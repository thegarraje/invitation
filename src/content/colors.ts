import type { ColorKey, ColorTheme } from "@/types/content";

export interface ColorVariant {
  key: ColorKey;
  label: string;
  shortLabel: string;
  tagline: string;
  voteCTA: string;
  theme: ColorTheme;
}

export const COLOR_VARIANTS: Record<ColorKey, ColorVariant> = {
  blue: {
    key: "blue",
    label: "Private Meeting",
    shortLabel: "Blue",
    tagline: "A deep oceanic tone balancing intensity and clarity.",
    voteCTA: "Confirm",
    theme: {
      base: "#0c607e",
      outer: "#38059f",
      orb: "#f16e2a",
      accent: "#c8eff2",
      text: "#ebf9fa"
    }
  },
  magenta: {
    key: "magenta",
    label: "Deep Project",
    shortLabel: "Magenta",
    tagline: "A rich chromatic accent with theatrical warmth.",
    voteCTA: "Confirm",
    theme: {
      base: "#b80449",
      outer: "#1f000e",
      orb: "#ff6600",
      accent: "#f2d5e2",
      text: "#ffe7f0"
    }
  },
  orange: {
    key: "orange",
    label: "A Rare\nMoment",
    shortLabel: "Orange",
    tagline: "A strong industrial orange with a sculptural presence.",
    voteCTA: "Confirm",
    theme: {
      base: "#ff6600",
      outer: "#3a001a",
      orb: "#ebf9fa",
      accent: "#ffe0cc",
      text: "#fff3eb"
    }
  },
  purple: {
    key: "purple",
    label: "New Positioning",
    shortLabel: "Purple",
    tagline: "A saturated tone inspired by iconic experimental interiors.",
    voteCTA: "Confirm",
    theme: {
      base: "#5a1060",
      outer: "#24012a",
      orb: "#ebf9fa",
      accent: "#e8d3eb",
      text: "#f7ecff"
    }
  },
  red: {
    key: "red",
    label: "Beyond Systems",
    shortLabel: "Red",
    tagline: "A vivid red statement designed to energize spaces.",
    voteCTA: "Confirm",
    theme: {
      base: "#cf0000",
      outer: "#590000",
      orb: "#ebf9fa",
      accent: "#ffd7d7",
      text: "#fff0f0"
    }
  },
  turquoise: {
    key: "turquoise",
    label: "Selective Access",
    shortLabel: "Turquoise",
    tagline: "A bright optimistic hue with crisp architectural contrast.",
    voteCTA: "Confirm",
    theme: {
      base: "#0d9aa6",
      outer: "#094961",
      orb: "#f16e2a",
      accent: "#dafbff",
      text: "#ebfcff"
    }
  },
  violet: {
    key: "violet",
    label: "Global Scale",
    shortLabel: "Violet",
    tagline: "A futuristic violet with bold depth and character.",
    voteCTA: "Confirm",
    theme: {
      base: "#3b0175",
      outer: "#20003f",
      orb: "#f16e2a",
      accent: "#ddd0f0",
      text: "#f5ecff"
    }
  }
};
