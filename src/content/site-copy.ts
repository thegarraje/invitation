import type { FooterSectionData, TimelineSectionData } from "@/types/content";
export { CONFIRM_PAGE_COPY } from "@/content/sections/confirm";
export { ADMIN_PAGE_COPY } from "@/content/sections/admin";

export const SHARED_TIMELINE: TimelineSectionData = {
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

export const SHARED_FOOTER: FooterSectionData = {
  id: "footer",
  title: "Project Links",
  body: "Static independent rebuild with local assets and no external runtime scripts.",
  links: [
    { label: "Vitra Home", href: "https://www.vitra.com", external: true },
    { label: "Privacy", href: "https://www.vitra.com/en-us/privacy-policy", external: true },
    { label: "Instagram", href: "https://www.instagram.com/vitra", external: true }
  ]
};

export const HOME_SCENE_COPY = {
  "/": {
    title: "Panton Chair Edition",
    subtitle: "A fully local independent rebuild of the Framer experience"
  },
  "/old-home": {
    title: "Panton Archive - Home",
    subtitle: "Original intro flow"
  },
  "/old-home-2": {
    title: "Panton Archive - Home 2",
    subtitle: "Alternate intro flow"
  }
} as const;

export const PHASE_HOME_COPY = {
  gap: {
    title: "Gap Phase"
  },
  vote: {
    title: "Vote Phase"
  },
  "vote-end": {
    title: "Vote End Phase"
  }
} as const;

export const TEST_SCENE_COPY = {
  title: "Form Test Page",
  subtitle: "Static-only behavior",
  description:
    "Form and vote interactions are intentionally local and non-persistent in this static rebuild."
} as const;
