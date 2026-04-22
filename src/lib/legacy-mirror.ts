const NO_MIRROR_PREFIXES = ["/vote-end-phase/", "/vote-phase/scoreboard/"];

export function getLegacyMirrorPath(routePath: string): string | undefined {
  if (NO_MIRROR_PREFIXES.some((prefix) => routePath.startsWith(prefix))) {
    return undefined;
  }

  if (routePath === "/") {
    return "/legacy-site/old-home.html";
  }

  if (routePath === "/old-home") {
    return "/legacy-site/old-home.html";
  }

  if (routePath === "/old-home-2") {
    return "/legacy-site/old-home.html";
  }

  if (routePath === "/tests/form-testing") {
    return "/legacy-site/index.html";
  }

  return `/legacy-site${routePath}.html`;
}
