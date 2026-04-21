import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const configPath = path.join(projectRoot, "config", "route-paths.json");
const outDir = path.join(projectRoot, "out");

const config = JSON.parse(await readFile(configPath, "utf8"));
const missing = [];

for (const route of config.routes) {
  const htmlPath =
    route === "/"
      ? path.join(outDir, "index.html")
      : path.join(outDir, route.replace(/^\//, ""), "index.html");

  try {
    await access(htmlPath);
  } catch {
    missing.push({ route, htmlPath });
  }
}

if (missing.length > 0) {
  console.error("Missing exported routes:");
  for (const item of missing) {
    console.error(`- ${item.route} -> ${item.htmlPath}`);
  }
  process.exit(1);
}

console.log(`Route parity OK. ${config.routes.length} routes found in static export.`);
