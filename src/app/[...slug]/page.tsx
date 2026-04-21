import { readdirSync } from "node:fs";
import * as path from "node:path";
import { ScenePage } from "@/components/layout/ScenePage";
import { ROUTE_PATHS } from "@/content/route-paths";
import { normalizeRoutePath, routePathToHtmlSlug } from "@/lib/route-normalize";

export const dynamicParams = false;

const LEGACY_SITE_ROOT = path.join(process.cwd(), "public", "legacy-site");
const LEGACY_DIRS_TO_SKIP = new Set(["_local_assets"]);

function collectLegacyHtmlPaths(relativeDir = ""): string[] {
  const absoluteDir = path.join(LEGACY_SITE_ROOT, relativeDir);
  const entries = readdirSync(absoluteDir, { withFileTypes: true });
  const results: string[] = [];

  for (const entry of entries) {
    if (entry.name.startsWith(".")) {
      continue;
    }

    const nextRelative = relativeDir ? `${relativeDir}/${entry.name}` : entry.name;

    if (entry.isDirectory()) {
      if (LEGACY_DIRS_TO_SKIP.has(entry.name)) {
        continue;
      }
      results.push(...collectLegacyHtmlPaths(nextRelative));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".html")) {
      results.push(nextRelative);
    }
  }

  return results;
}

function addSlugParam(map: Map<string, { slug: string[] }>, slug: string[]) {
  if (slug.length === 0) {
    return;
  }
  map.set(slug.join("/"), { slug });
}

export function generateStaticParams() {
  const params = new Map<string, { slug: string[] }>();
  const knownCleanRoutes = new Set(ROUTE_PATHS);

  for (const routePath of ROUTE_PATHS) {
    if (routePath === "/") {
      continue;
    }
    addSlugParam(params, routePathToHtmlSlug(routePath));
  }

  for (const legacyHtmlPath of collectLegacyHtmlPaths()) {
    if (legacyHtmlPath !== "index.html") {
      addSlugParam(params, legacyHtmlPath.split("/"));
    }

    const cleanPath = legacyHtmlPath.replace(/\.html$/, "");
    if (cleanPath === "index") {
      continue;
    }

    const normalizedCleanPath = normalizeRoutePath(`/${cleanPath}`);
    if (!knownCleanRoutes.has(normalizedCleanPath)) {
      addSlugParam(params, cleanPath.split("/"));
    }
  }

  return Array.from(params.values());
}

export default async function LegacyHtmlAliasPage({
  params
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const rawPath = `/${slug.join("/")}`;
  const normalizedPath = normalizeRoutePath(rawPath);

  return <ScenePage path={normalizedPath} rawPath={rawPath} />;
}
