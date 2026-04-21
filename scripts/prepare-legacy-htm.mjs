import { existsSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

const legacyRoot = path.join(process.cwd(), "public", "legacy-site");

function walk(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      walk(fullPath);
      continue;
    }

    if (!entry.isFile() || !entry.name.endsWith(".html")) {
      continue;
    }

    const source = readFileSync(fullPath, "utf8");
    const htmPath = fullPath.replace(/\.html$/, ".htm");
    // Legacy pages are served from /legacy-site/*.htm inside an iframe.
    // Normalize internal route links so they resolve from site root, while
    // preserving local asset references under ./_local_assets and ./assets.
    const mirrored = source.replace(
      /href="\.\//g,
      (match, offset) => {
        const ahead = source.slice(offset);
        if (
          ahead.startsWith('href="./_local_assets/') ||
          ahead.startsWith('href="./assets/')
        ) {
          return match;
        }
        return 'href="/';
      }
    );

    writeFileSync(htmPath, mirrored);
  }
}

if (!existsSync(legacyRoot)) {
  console.log("prepare-legacy-htm: skipped (public/legacy-site not found)");
  process.exit(0);
}

// Clean stale generated .htm files first to keep deterministic output.
function cleanGeneratedHtm(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      cleanGeneratedHtm(fullPath);
      continue;
    }
    if (entry.isFile() && entry.name.endsWith(".htm")) {
      rmSync(fullPath);
    }
  }
}

cleanGeneratedHtm(legacyRoot);
walk(legacyRoot);
console.log("prepare-legacy-htm: generated .htm mirrors from legacy .html pages");
