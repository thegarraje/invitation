import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { globby } from "globby";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const outDir = path.join(projectRoot, "out");

const blockedHostPatterns = [
  /(?:https?:)?\/\/[^"'\s]*framerusercontent\.com/gi,
  /(?:https?:)?\/\/[^"'\s]*app\.framerstatic\.com/gi,
  /(?:https?:)?\/\/[^"'\s]*events\.framer\.com/gi,
  /(?:https?:)?\/\/[^"'\s]*googletagmanager\.com/gi,
  /(?:https?:)?\/\/[^"'\s]*google-analytics\.com/gi,
  /(?:https?:)?\/\/[^"'\s]*usercentrics[^"'\s]*/gi,
  /(?:https?:)?\/\/[^"'\s]*framer\.com\/edit[^"'\s]*/gi,
  /(?:https?:)?\/\/[^"'\s]*api\.framer\.com/gi,
  /(?:https?:)?\/\/[^"'\s]*api\.sheety\.co/gi,
  /(?:https?:)?\/\/[^"'\s]*recaptcha[^"'\s]*/gi
];

const files = await globby(["**/*.{html,js,css,json}"], {
  cwd: outDir,
  absolute: true,
  onlyFiles: true
});

const hits = [];

for (const file of files) {
  const content = await readFile(file, "utf8");
  for (const pattern of blockedHostPatterns) {
    const matches = content.match(pattern);
    if (matches && matches.length > 0) {
      for (const match of matches) {
        hits.push({ file, host: match });
      }
    }
  }
}

if (hits.length > 0) {
  console.error("Blocked external references found in output:");
  for (const hit of hits) {
    console.error(`- ${hit.host} in ${hit.file}`);
  }
  process.exit(1);
}

console.log("No blocked external runtime references found in static output.");
