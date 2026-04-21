const NO_MIRROR_PREFIXES = ["/vote-end-phase/", "/vote-phase/scoreboard/"];

export function getLegacyMirrorPath(routePath: string): string | undefined {
  if (NO_MIRROR_PREFIXES.some((prefix) => routePath.startsWith(prefix))) {
    return undefined;
  }

  if (routePath === "/") {
    return "/legacy-site/old-home.htm";
  }

  if (routePath === "/old-home") {
    return "/legacy-site/old-home.htm";
  }

  if (routePath === "/old-home-2") {
    return "/legacy-site/old-home.htm";
  }

  if (routePath === "/tests/form-testing") {
    return "/legacy-site/index.htm";
  }

  return `/legacy-site${routePath}.htm`;
}
