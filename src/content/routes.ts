import { COLOR_VARIANTS } from "@/content/colors";
import { COLOR_KEYS, ROUTE_PATHS, WINNING_COLOR_KEYS } from "@/content/route-paths";
import type {
  ColorKey,
  ColorsSectionData,
  FooterSectionData,
  RouteScene,
  TimelineSectionData
} from "@/types/content";

const SHARED_TIMELINE: TimelineSectionData = {
  id: "timeline",
  title: "From Story To Selection",
  items: [
    {
      label: "01",
      title: "Design Legacy",
      body: "Verner Panton's work treated color as architecture and atmosphere."
    },
    {
      label: "02",
      title: "Audience Voting",
      body: "Each phase turns color selection into a shared decision rather than a guess."
    },
    {
      label: "03",
      title: "Release Outcome",
      body: "Winning tones move forward into launch-ready product storytelling."
    }
  ]
};

const SHARED_FOOTER: FooterSectionData = {
  id: "footer",
  title: "Project Links",
  body: "Static independent rebuild with local assets and no external runtime scripts.",
  links: [
    { label: "Vitra Home", href: "https://www.vitra.com", external: true },
    { label: "Privacy", href: "https://www.vitra.com/en-us/privacy-policy", external: true },
    { label: "Instagram", href: "https://www.instagram.com/vitra", external: true }
  ]
};

function buildColorLinks(basePath: string, active?: ColorKey): ColorsSectionData {
  return {
    id: "colors",
    title: "Colour Palette",
    body: "Explore every palette variant while preserving route parity with the original Framer map.",
    links: COLOR_KEYS.map((key) => ({
      key,
      label: COLOR_VARIANTS[key].label,
      href: `${basePath}/${key}`,
      active: active === key
    }))
  };
}

function navForColor(pathPrefix: string, color: ColorKey, homeBack: string) {
  const index = COLOR_KEYS.indexOf(color);
  const prev = index <= 0 ? homeBack : `${pathPrefix}/${COLOR_KEYS[index - 1]}`;
  const next = index >= COLOR_KEYS.length - 1 ? homeBack : `${pathPrefix}/${COLOR_KEYS[index + 1]}`;
  return { prev, next, close: homeBack };
}

function navForWinning(color: ColorKey) {
  const index = WINNING_COLOR_KEYS.indexOf(color);
  const prev = index <= 0 ? "/gap-phase/home-back" : `/gap-phase/winning/${WINNING_COLOR_KEYS[index - 1]}`;
  const next =
    index >= WINNING_COLOR_KEYS.length - 1
      ? "/vote-phase/home-back"
      : `/gap-phase/winning/${WINNING_COLOR_KEYS[index + 1]}`;
  return { prev, next, close: "/gap-phase/home-back" };
}

function homeScene(path: string, title: string, subtitle: string): RouteScene {
  const introTheme = COLOR_VARIANTS.blue.theme;
  return {
    path,
    phase: path === "/" ? "intro" : "legacy",
    kind: "home",
    sectionOrder: ["hero", "timeline", "colors", "footer"],
    nav: {
      prev: path === "/" ? undefined : "/",
      next: "/gap-phase/home-back",
      close: "/"
    },
    hero: {
      id: "hero",
      title,
      subtitle,
      description:
        "The edition is based on the colour palette of Panton's legendary interior landscapes and his experimental approach to colour.",
      ctaLabel: "Early Access",
      ctaHref: "https://www.vitra.com/product/details/panton-chair",
      theme: introTheme
    },
    timeline: SHARED_TIMELINE,
    colors: buildColorLinks("/gap-phase/colors"),
    footer: SHARED_FOOTER
  };
}

function phaseHomeScene(path: string, phase: RouteScene["phase"], title: string, color: ColorKey): RouteScene {
  const variant = COLOR_VARIANTS[color];
  const phasePrefix = path.split("/").slice(0, 3).join("/");
  const colorBasePath = `${phasePrefix}/colors`;
  return {
    path,
    phase,
    kind: "phase-home",
    sectionOrder: ["hero", "timeline", "colors", "footer"],
    nav: {
      prev: phase === "gap" ? "/" : phase === "vote" ? "/gap-phase/home-back" : "/vote-phase/home-back",
      next: `${colorBasePath}/${COLOR_KEYS[0]}`,
      close: "/"
    },
    hero: {
      id: "hero",
      title,
      subtitle: "Choose, compare, and move through each palette route.",
      description: variant.tagline,
      ctaLabel: phase === "vote" ? "Confirm" : variant.voteCTA,
      ctaHref: phase === "vote" ? "/confirm" : `${colorBasePath}/${variant.key}`,
      theme: variant.theme
    },
    timeline: SHARED_TIMELINE,
    colors: buildColorLinks(colorBasePath),
    footer: SHARED_FOOTER
  };
}

function colorScene(path: string, phase: RouteScene["phase"], kind: RouteScene["kind"], color: ColorKey): RouteScene {
  const variant = COLOR_VARIANTS[color];

  const nav =
    kind === "winning"
      ? navForWinning(color)
      : kind === "scoreboard"
        ? navForColor("/vote-phase/scoreboard", color, "/vote-phase/home-back")
        : phase === "gap"
          ? navForColor("/gap-phase/colors", color, "/gap-phase/home-back")
          : phase === "vote"
            ? navForColor("/vote-phase/colors", color, "/vote-phase/home-back")
            : navForColor("/vote-end-phase/colors", color, "/vote-end-phase/home-back");

  const colorsBase =
    kind === "winning"
      ? "/gap-phase/colors"
      : kind === "scoreboard"
        ? "/vote-phase/scoreboard"
        : phase === "gap"
          ? "/gap-phase/colors"
          : phase === "vote"
            ? "/vote-phase/colors"
            : "/vote-end-phase/colors";

  const subtitleByKind: Record<RouteScene["kind"], string> = {
    home: "",
    "phase-home": "",
    color: "Vote route",
    winning: "Winning route",
    scoreboard: "Scoreboard route",
    test: ""
  };

  return {
    path,
    phase,
    kind,
    colorKey: color,
    sectionOrder: ["hero", "timeline", "colors", "footer"],
    nav,
    hero: {
      id: "hero",
      title: variant.label,
      subtitle: subtitleByKind[kind],
      description: variant.tagline,
      ctaLabel: kind === "scoreboard" ? "Back To Vote" : phase === "vote" ? "Confirm" : variant.voteCTA,
      ctaHref:
        kind === "scoreboard"
          ? `/vote-phase/colors/${variant.key}`
          : phase === "vote"
            ? "/confirm"
            : `/vote-phase/colors/${variant.key}`,
      theme: variant.theme
    },
    timeline: {
      ...SHARED_TIMELINE,
      items: [
        {
          label: "01",
          title: `${variant.shortLabel} Story`,
          body: variant.tagline
        },
        {
          label: "02",
          title: kind === "scoreboard" ? "Current Standing" : "Audience Interaction",
          body:
            kind === "scoreboard"
              ? "Static scoreboard view in this rebuild (no external tracking or persistence)."
              : "Selection is preserved as a static route flow for local-only publishing."
        },
        {
          label: "03",
          title: "Product Direction",
          body: "Each color route keeps visual intent while using modern reusable Next.js sections."
        }
      ]
    },
    colors: buildColorLinks(colorsBase, color),
    footer: SHARED_FOOTER
  };
}

const scenes = new Map<string, RouteScene>();

scenes.set(
  "/",
  homeScene(
    "/",
    "Panton Chair Edition",
    "A fully local independent rebuild of the Framer experience"
  )
);
scenes.set("/old-home", homeScene("/old-home", "Panton Archive - Home", "Original intro flow"));
scenes.set("/old-home-2", homeScene("/old-home-2", "Panton Archive - Home 2", "Alternate intro flow"));

scenes.set(
  "/tests/form-testing",
  {
    path: "/tests/form-testing",
    phase: "test",
    kind: "test",
    sectionOrder: ["hero", "timeline", "colors", "footer"],
    nav: { prev: "/", next: "/vote-phase/home-back", close: "/" },
    hero: {
      id: "hero",
      title: "Form Test Page",
      subtitle: "Static-only behavior",
      description:
        "Form and vote interactions are intentionally local and non-persistent in this static rebuild.",
      ctaLabel: "Back Home",
      ctaHref: "/",
      theme: COLOR_VARIANTS.turquoise.theme
    },
    timeline: {
      ...SHARED_TIMELINE,
      title: "Static Behavior Notes",
      items: [
        {
          label: "01",
          title: "No External APIs",
          body: "No calls to framer, analytics, usercentrics, or remote vote endpoints."
        },
        {
          label: "02",
          title: "UI Preserved",
          body: "Interactive controls are retained visually for route and UX parity."
        },
        {
          label: "03",
          title: "Static Export",
          body: "All pages are generated for independent static hosting."
        }
      ]
    },
    colors: buildColorLinks("/vote-phase/colors"),
    footer: SHARED_FOOTER
  }
);

scenes.set(
  "/gap-phase/home-back",
  phaseHomeScene(
    "/gap-phase/home-back",
    "gap",
    "Gap Phase",
    "orange"
  )
);
scenes.set(
  "/vote-phase/home-back",
  phaseHomeScene(
    "/vote-phase/home-back",
    "vote",
    "Vote Phase",
    "red"
  )
);
scenes.set(
  "/vote-end-phase/home-back",
  phaseHomeScene(
    "/vote-end-phase/home-back",
    "vote-end",
    "Vote End Phase",
    "violet"
  )
);

for (const key of COLOR_KEYS) {
  scenes.set(`/gap-phase/colors/${key}`, colorScene(`/gap-phase/colors/${key}`, "gap", "color", key));
  scenes.set(`/vote-phase/colors/${key}`, colorScene(`/vote-phase/colors/${key}`, "vote", "color", key));
  scenes.set(
    `/vote-phase/scoreboard/${key}`,
    colorScene(`/vote-phase/scoreboard/${key}`, "vote", "scoreboard", key)
  );
  scenes.set(
    `/vote-end-phase/colors/${key}`,
    colorScene(`/vote-end-phase/colors/${key}`, "vote-end", "color", key)
  );
}

for (const key of WINNING_COLOR_KEYS) {
  scenes.set(`/gap-phase/winning/${key}`, colorScene(`/gap-phase/winning/${key}`, "gap", "winning", key));
}

export function getRouteScene(path: string): RouteScene | undefined {
  return scenes.get(path);
}

export function getAllScenes(): RouteScene[] {
  return ROUTE_PATHS.map((path) => scenes.get(path)).filter((scene): scene is RouteScene => Boolean(scene));
}
