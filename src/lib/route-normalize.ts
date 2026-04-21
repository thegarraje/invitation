export function normalizeRoutePath(inputPath: string): string {
  let path = inputPath.trim();

  if (!path.startsWith("/")) {
    path = `/${path}`;
  }

  if (path.startsWith("/legacy-site/")) {
    path = path.slice("/legacy-site".length) || "/";
  }

  path = path.replace(/\/{2,}/g, "/");

  if (path.length > 1 && path.endsWith("/")) {
    path = path.slice(0, -1);
  }

  if (path === "/index.html" || path === "/index.htm" || path === "/index") {
    return "/";
  }

  if (path.endsWith(".html")) {
    path = path.slice(0, -5) || "/";
  }

  if (path.endsWith(".htm")) {
    path = path.slice(0, -4) || "/";
  }

  if (path.endsWith("/index")) {
    path = path.slice(0, -6) || "/";
  }

  return path || "/";
}

export function routePathToHtmlSlug(routePath: string): string[] {
  if (routePath === "/") {
    return ["index.html"];
  }

  const segments = routePath.replace(/^\//, "").split("/");
  const last = segments.at(-1);

  if (last) {
    segments[segments.length - 1] = `${last}.html`;
  }

  return segments;
}

export function routePathToLegacyAliasSlug(routePath: string, extension: "html" | "htm"): string[] {
  if (routePath === "/") {
    return ["legacy-site", `index.${extension}`];
  }

  const segments = routePath.replace(/^\//, "").split("/");
  const last = segments.at(-1);

  if (last) {
    segments[segments.length - 1] = `${last}.${extension}`;
  }

  return ["legacy-site", ...segments];
}
