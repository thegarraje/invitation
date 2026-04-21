import { notFound } from "next/navigation";
import { ScenePage } from "@/components/layout/ScenePage";
import { ROUTE_PATHS } from "@/content/route-paths";
import { getRouteScene } from "@/content/routes";
import {
  normalizeRoutePath,
  routePathToHtmlSlug,
  routePathToLegacyAliasSlug
} from "@/lib/route-normalize";

export const dynamicParams = false;

function addSlugParam(map: Map<string, { slug: string[] }>, slug: string[]) {
  if (slug.length === 0) {
    return;
  }
  map.set(slug.join("/"), { slug });
}

export function generateStaticParams() {
  const params = new Map<string, { slug: string[] }>();

  // Explicit alias coverage for ".html"/".htm" and legacy prefixed URLs.
  for (const routePath of ROUTE_PATHS) {
    if (routePath !== "/") {
      addSlugParam(params, routePathToHtmlSlug(routePath));
      addSlugParam(
        params,
        routePathToHtmlSlug(routePath).map((segment, index, all) =>
          index === all.length - 1 ? segment.replace(/\.html$/, ".htm") : segment
        )
      );
    }

    addSlugParam(params, routePathToLegacyAliasSlug(routePath, "html"));
    addSlugParam(params, routePathToLegacyAliasSlug(routePath, "htm"));
  }

  return Array.from(params.values());
}

export default async function HtmlAliasPage({
  params
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const rawPath = `/${slug.join("/")}`;
  const normalizedPath = normalizeRoutePath(rawPath);
  const scene = getRouteScene(normalizedPath);

  if (!scene) {
    notFound();
  }

  return <ScenePage path={normalizedPath} />;
}
