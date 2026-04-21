import { readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const ASSET_ROOT = path.join(ROOT, "public", "_local_assets");
const REPORT_PATH = path.join(ROOT, "config", "asset-prune-report.json");

const SCAN_DIRS = [
  path.join(ROOT, "public", "legacy-site"),
  path.join(ROOT, "src"),
  path.join(ROOT, "config")
];

const SCAN_EXTENSIONS = new Set([
  ".html",
  ".htm",
  ".css",
  ".js",
  ".mjs",
  ".json",
  ".ts",
  ".tsx"
]);

const EXCLUDED_SCAN_FILES = new Set([
  "asset-manifest.json",
  "asset-prune-report.json"
]);

const REFERENCE_REGEX = /(?:["'`(=\s]|^)(\/?_local_assets\/[^\s"'`()<>\\]+)/g;
const apply = process.argv.includes("--apply");

async function listFilesRecursive(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.name.startsWith(".")) {
      continue;
    }

    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listFilesRecursive(absolutePath)));
      continue;
    }

    files.push(absolutePath);
  }

  return files;
}

function normalizeAssetReference(reference) {
  const cleaned = reference
    .replace(/^\/+/, "")
    .split("?")[0]
    .split("#")[0];

  try {
    return decodeURIComponent(cleaned);
  } catch {
    return cleaned;
  }
}

async function collectReferencedAssets() {
  const referenced = new Set();
  const scannedFiles = [];

  for (const dir of SCAN_DIRS) {
    const files = await listFilesRecursive(dir);
    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      const base = path.basename(file);
      if (!SCAN_EXTENSIONS.has(ext) || EXCLUDED_SCAN_FILES.has(base)) {
        continue;
      }

      const raw = await readFile(file, "utf8").catch(() => "");
      if (!raw) {
        continue;
      }

      scannedFiles.push(path.relative(ROOT, file));
      for (const match of raw.matchAll(REFERENCE_REGEX)) {
        const value = match[1];
        if (!value) {
          continue;
        }
        referenced.add(normalizeAssetReference(value));
      }
    }
  }

  return { referenced, scannedFiles };
}

async function removeEmptyDirectories(directory) {
  const entries = await readdir(directory, { withFileTypes: true }).catch(() => []);

  for (const entry of entries) {
    if (entry.isDirectory()) {
      await removeEmptyDirectories(path.join(directory, entry.name));
    }
  }

  const remaining = await readdir(directory).catch(() => []);
  if (remaining.length === 0) {
    await rm(directory, { recursive: true, force: true });
  }
}

async function main() {
  const allAssetFiles = await listFilesRecursive(ASSET_ROOT);
  const { referenced, scannedFiles } = await collectReferencedAssets();

  if (referenced.size === 0) {
    throw new Error("No _local_assets references were detected. Refusing to prune.");
  }

  const unused = [];
  let bytesRemoved = 0;

  for (const file of allAssetFiles) {
    const relative = path.relative(path.join(ROOT, "public"), file).replaceAll(path.sep, "/");

    if (referenced.has(relative)) {
      continue;
    }

    const size = (await stat(file).catch(() => ({ size: 0 }))).size || 0;
    unused.push({ relative, size });
    bytesRemoved += size;

    if (apply) {
      await rm(file, { force: true });
    }
  }

  if (apply) {
    await removeEmptyDirectories(ASSET_ROOT);
  }

  const report = {
    mode: apply ? "apply" : "dry-run",
    scannedFileCount: scannedFiles.length,
    referencedAssetCount: referenced.size,
    totalAssetsChecked: allAssetFiles.length,
    unusedAssetCount: unused.length,
    unusedAssetBytes: bytesRemoved,
    unusedAssets: unused.map((item) => item.relative).sort()
  };

  await writeFile(REPORT_PATH, JSON.stringify(report, null, 2), "utf8");

  const mb = (bytesRemoved / (1024 * 1024)).toFixed(2);
  console.log(
    `asset-prune: ${apply ? "removed" : "found"} ${unused.length} unreferenced assets (${mb} MB)`
  );
  console.log(`asset-prune: report saved to ${path.relative(ROOT, REPORT_PATH)}`);
}

main().catch((error) => {
  console.error("asset-prune: failed", error);
  process.exitCode = 1;
});
