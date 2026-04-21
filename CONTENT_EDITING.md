# Content Editing Guide

This project has three content layers:

1. Next.js route content (`src/content`)
2. Legacy homepage adapter copy (`src/content/sections/home-legacy-copy.json`)
3. Legacy mirrored Framer pages (`public/legacy-site`)

## 1) Edit Next.js Content

Main copy files:

- `src/content/site-copy.ts`
  - shared timeline copy
  - shared footer copy
  - home/phase/test titles and subtitles
- `src/content/navigation.ts`
  - bottom nav labels and ABG brand text used by Next.js-rendered routes
- `src/content/sections/confirm.ts`
  - confirm page title and iframe URL
- `src/content/sections/admin.ts`
  - static admin informational copy and CTA labels
- `src/content/colors.ts`
  - color labels, taglines, and theme palette values
- `src/content/routes.ts`
  - route-to-section composition and CTA routing logic

## 2) Edit Legacy Animated Homepage Copy (No Hashed Runtime Editing)

Source of truth:

- `src/content/sections/home-legacy-copy.json`

Build sync target (generated):

- `public/legacy-site/assets/custom/legacy-copy.json`

The copy is applied at runtime by the legacy adapter in:

- `public/legacy-site/assets/custom/confirm-cta.js`

This avoids editing hash-named Framer runtime bundles directly.

`home-legacy-copy.json` supports:

- `cta`
  - `targetPath`
  - `buttonLabel`
  - `acceptedLabels`
- `global` / `pages[route]` entry fields:
  - `selector` or `name` (target strategy)
  - `matchTextIncludes` (optional text filter)
  - `index` (optional, if you need one specific target)
  - `applyToAll` (set `true` to patch every matching target)
  - `text` (replacement text)

## 3) Edit Legacy Mirror CTA Behavior

Primary source:

- `src/content/sections/home-legacy-copy.json` (`cta` object)

Runtime adapter:

- `public/legacy-site/assets/custom/confirm-cta.js`

The adapter reads `cta` from the manifest and updates:

- confirm destination path
- confirm button label
- accepted button text variants
- forms.app embed settings

## 4) Legacy Mirror Styling Tweaks

File:

- `public/legacy-site/assets/custom/overrides.css`

Use this for typography/word-break fixes that must apply inside mirrored pages.

## 5) Build/Run

- Local dev: `npm run dev`
- Production build: `npm run build`
- Optional asset cleanup report: `npm run prune:assets`
- Apply asset cleanup: `npm run optimize:assets`

If you edit files in `public/legacy-site`, rebuild before deployment.
If you edit `src/content/sections/home-legacy-copy.json`, run `npm run sync:legacy-copy` (or just `npm run build`, which includes it).
