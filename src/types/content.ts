export type PhaseKind = "intro" | "gap" | "vote" | "vote-end" | "legacy" | "test";

export type SceneKind =
  | "home"
  | "phase-home"
  | "color"
  | "winning"
  | "scoreboard"
  | "test";

export type SectionKind = "hero" | "timeline" | "colors" | "footer";

export type ColorKey =
  | "blue"
  | "magenta"
  | "orange"
  | "purple"
  | "red"
  | "turquoise"
  | "violet";

export interface MotionPreset {
  initial: Record<string, number | string>;
  animate: Record<string, number | string>;
  transition: {
    delay?: number;
    duration: number;
    ease: [number, number, number, number];
    type?: "tween" | "spring";
  };
  viewport?: { amount: number; once: boolean };
}

export interface ColorTheme {
  base: string;
  outer: string;
  orb: string;
  accent: string;
  text: string;
}

export interface HeroSectionData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
  theme: ColorTheme;
}

export interface TimelineItem {
  label: string;
  title: string;
  body: string;
}

export interface TimelineSectionData {
  id: string;
  title: string;
  items: TimelineItem[];
}

export interface ColorLink {
  key: ColorKey;
  label: string;
  href: string;
  active?: boolean;
}

export interface ColorsSectionData {
  id: string;
  title: string;
  body: string;
  links: ColorLink[];
}

export interface FooterSectionData {
  id: string;
  title: string;
  body: string;
  links: Array<{ label: string; href: string; external?: boolean }>;
}

export interface RouteNavigation {
  prev?: string;
  next?: string;
  close?: string;
}

export interface RouteScene {
  path: string;
  phase: PhaseKind;
  kind: SceneKind;
  colorKey?: ColorKey;
  sectionOrder: SectionKind[];
  nav: RouteNavigation;
  hero: HeroSectionData;
  timeline: TimelineSectionData;
  colors: ColorsSectionData;
  footer: FooterSectionData;
}
