import type { FooterSectionData, TimelineSectionData } from "@/types/content";
export { CONFIRM_PAGE_COPY } from "@/content/sections/confirm";
export { ADMIN_PAGE_COPY } from "@/content/sections/admin";

export const SHARED_TIMELINE: TimelineSectionData = {
  id: "timeline",
  title: "Assembly Context",
  items: [
    {
      label: "01",
      title: "Meeting Context",
      body:
        "This is a private, single-time assembly for invited physician participants to align on urgent priorities."
    },
    {
      label: "02",
      title: "Action Required",
      body:
        "If you received an invitation, continue using your unique access code to confirm your presence and complete the NDA signature process."
    },
    {
      label: "03",
      title: "Younes Diouri",
      body: "\"Progress starts when trusted experts move in one direction.\""
    }
  ]
};

export const SHARED_FOOTER: FooterSectionData = {
  id: "footer",
  title: "Access Links",
  body: "Invitation-only flow with native static pages and external confirm form delivery.",
  links: [
    { label: "Confirm Invitation", href: "/confirm", external: false },
    { label: "Instagram", href: "https://www.instagram.com/vitra", external: true }
  ]
};

export const HOME_SCENE_COPY = {
  "/": {
    title: "Welcome to the First Assembly of the American New Board.",
    subtitle: "A secure invitation-only meeting for trusted physician participation.",
    description:
      "This private gathering brings together invited specialists to align decisions, accelerate collaboration, and move from discussion to coordinated action."
  },
  "/old-home": {
    title: "Welcome to the First Assembly of the American New Board.",
    subtitle: "A secure invitation-only meeting for trusted physician participation.",
    description:
      "This private gathering brings together invited specialists to align decisions, accelerate collaboration, and move from discussion to coordinated action."
  },
  "/old-home-2": {
    title: "Welcome to the First Assembly of the American New Board.",
    subtitle: "A secure invitation-only meeting for trusted physician participation.",
    description:
      "This private gathering brings together invited specialists to align decisions, accelerate collaboration, and move from discussion to coordinated action."
  }
} as const;

export const PHASE_HOME_COPY = {
  gap: {
    title: "Assembly Preparation",
    subtitle: "DAYS LEFT TO CONFIRM",
    description: "Finalize your confirmation and keep your invitation active."
  },
  vote: {
    title: "Confirmation Phase",
    subtitle: "DAYS LEFT TO CONFIRM",
    description: "Use your invitation access to complete your attendance and NDA confirmation."
  },
  "vote-end": {
    title: "Final Confirmation",
    subtitle: "DAYS LEFT TO CONFIRM",
    description: "Submission window is limited. Complete your confirmation before closing."
  }
} as const;

export const TEST_SCENE_COPY = {
  title: "Confirmation Test Page",
  subtitle: "Static Native Behavior",
  description:
    "Form interaction is handled externally via the confirm page iframe in this static native rebuild."
} as const;
