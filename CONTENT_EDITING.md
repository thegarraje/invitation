# Content Editing Guide

This project has two content layers:

1. Next.js route content (`src/content`)
2. Legacy mirrored Framer pages (`public/legacy-site`)

## 1) Edit Next.js Content

Main copy files:

- `src/content/site-copy.ts`
  - shared timeline copy
  - shared footer copy
  - home/phase/test titles and subtitles
  - confirm page copy
  - admin page copy
- `src/content/colors.ts`
  - color labels, taglines, and theme palette values
- `src/content/routes.ts`
  - route-to-section composition and CTA routing logic

## 2) Edit Legacy Mirror CTA Behavior

File:

- `public/legacy-site/assets/custom/confirm-cta.js`

Update the `SETTINGS` object at the top to change:

- confirm destination path
- confirm button label
- accepted button text variants
- forms.app embed settings

## 3) Legacy Mirror Styling Tweaks

File:

- `public/legacy-site/assets/custom/overrides.css`

Use this for typography/word-break fixes that must apply inside mirrored pages.

## 4) Build/Run

- Local dev: `npm run dev`
- Production build: `npm run build`

If you edit files in `public/legacy-site`, rebuild before deployment.
