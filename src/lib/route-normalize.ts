export function normalizeRoutePath(inputPath: string): string {
  let path = inputPath.trim();

  if (!path.startsWith("/")) {
    path = `/${path}`;
  }

  path = path.replace(/\/{2,}/g, "/");

  if (path.length > 1 && path.endsWith("/")) {
    path = path.slice(0, -1);
  }

  if (path === "/index.html" || path === "/index") {
    return "/";
  }

  if (path.endsWith(".html")) {
    path = path.slice(0, -5) || "/";
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
