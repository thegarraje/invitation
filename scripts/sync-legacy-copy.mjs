import { copyFileSync, mkdirSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const source = path.join(root, "src", "content", "sections", "home-legacy-copy.json");
const targetDir = path.join(root, "public", "legacy-site", "assets", "custom");
const target = path.join(targetDir, "legacy-copy.json");

mkdirSync(targetDir, { recursive: true });
copyFileSync(source, target);

console.log("sync-legacy-copy: copied src/content/sections/home-legacy-copy.json to public/legacy-site/assets/custom/legacy-copy.json");

