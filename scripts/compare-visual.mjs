import http from "node:http";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const legacyRoot = process.env.LEGACY_SOURCE || "/Users/younesdiouri/Desktop/cleaniv/new/www.panton.vitra.com_static";
const rebuiltRoot = path.join(projectRoot, "out");
const reportDir = path.join(projectRoot, "reports", "visual");
const threshold = Number(process.env.VISUAL_THRESHOLD || "0.45");

const config = JSON.parse(await readFile(path.join(projectRoot, "config", "route-paths.json"), "utf8"));

function toFilePath(route) {
  if (route === "/") {
    return "index.html";
  }
  return `${route.replace(/^\//, "")}/index.html`;
}

function legacyRouteToFile(route) {
  if (route === "/") return "index.html";
  if (route === "/old-home") return "old-home.html";
  if (route === "/old-home-2") return "old-home.html";
  if (route === "/tests/form-testing") return "index.html";

  const htmlPath = `${route.replace(/^\//, "")}.html`;
  return htmlPath;
}

function safeName(route) {
  return route === "/" ? "root" : route.slice(1).replaceAll("/", "__");
}

function contentType(file) {
  if (file.endsWith(".html")) return "text/html; charset=utf-8";
  if (file.endsWith(".js")) return "application/javascript; charset=utf-8";
  if (file.endsWith(".css")) return "text/css; charset=utf-8";
  if (file.endsWith(".png")) return "image/png";
  if (file.endsWith(".jpg") || file.endsWith(".jpeg")) return "image/jpeg";
  if (file.endsWith(".webp")) return "image/webp";
  if (file.endsWith(".gif")) return "image/gif";
  if (file.endsWith(".svg")) return "image/svg+xml";
  if (file.endsWith(".woff2")) return "font/woff2";
  if (file.endsWith(".json")) return "application/json";
  return "application/octet-stream";
}

function createStaticServer(rootDir) {
  return http.createServer(async (req, res) => {
    try {
      const requestPath = decodeURIComponent(req.url?.split("?")[0] || "/");
      const normalized = requestPath === "/" ? "/index.html" : requestPath;
      const target = path.join(rootDir, normalized.replace(/^\//, ""));
      const data = await readFile(target);
      res.writeHead(200, { "content-type": contentType(target) });
      res.end(data);
    } catch {
      res.writeHead(404, { "content-type": "text/plain" });
      res.end("Not found");
    }
  });
}

async function startServer(server, port) {
  await new Promise((resolve) => server.listen(port, resolve));
}

await mkdir(reportDir, { recursive: true });

const legacyServer = createStaticServer(legacyRoot);
const rebuiltServer = createStaticServer(rebuiltRoot);

await startServer(legacyServer, 4173);
await startServer(rebuiltServer, 4174);

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();

const failed = [];

for (const route of config.routes) {
  const routeName = safeName(route);

  const rebuiltURL = `http://127.0.0.1:4174/${toFilePath(route)}`;
  await page.goto(rebuiltURL, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1200);
  const rebuiltShot = path.join(reportDir, `${routeName}--new.png`);
  await page.screenshot({ path: rebuiltShot, fullPage: true });

  const legacyRelative = legacyRouteToFile(route);
  const legacyAbsolute = path.join(legacyRoot, legacyRelative);

  try {
    await stat(legacyAbsolute);
  } catch {
    continue;
  }

  const legacyURL = `http://127.0.0.1:4173/${legacyRelative}`;
  await page.goto(legacyURL, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1200);
  const legacyShot = path.join(reportDir, `${routeName}--legacy.png`);
  await page.screenshot({ path: legacyShot, fullPage: true });

  const oldPng = PNG.sync.read(await readFile(legacyShot));
  const newPng = PNG.sync.read(await readFile(rebuiltShot));

  const width = Math.min(oldPng.width, newPng.width);
  const height = Math.min(oldPng.height, newPng.height);

  const oldCrop = new PNG({ width, height });
  PNG.bitblt(oldPng, oldCrop, 0, 0, width, height, 0, 0);

  const newCrop = new PNG({ width, height });
  PNG.bitblt(newPng, newCrop, 0, 0, width, height, 0, 0);

  const diff = new PNG({ width, height });
  const mismatched = pixelmatch(oldCrop.data, newCrop.data, diff.data, width, height, {
    threshold: 0.1
  });

  const ratio = mismatched / (width * height);

  await writeFile(path.join(reportDir, `${routeName}--diff.png`), PNG.sync.write(diff));

  if (ratio > threshold) {
    failed.push({ route, ratio });
  }
}

await browser.close();
legacyServer.close();
rebuiltServer.close();

if (failed.length > 0) {
  console.error("Visual comparison failed for:");
  for (const item of failed) {
    console.error(`- ${item.route} (diff ratio ${(item.ratio * 100).toFixed(2)}%)`);
  }
  process.exit(1);
}

console.log("Visual comparison complete. All compared routes are within threshold.");
