# Content Editing Guide

All user-visible copy is now centralized in `src/content`.

## Main Files To Edit

- `src/content/site-copy.ts`
  - homepage/assembly text
  - timeline copy
  - footer copy
  - phase labels and subtitles
- `src/content/routes.ts`
  - CTA routes and labels (including confirm behavior)
  - section composition per route
  - route-specific hero/timeline text behavior
- `src/content/navigation.ts`
  - bottom navigation labels
  - brand logo path + brand label
- `src/content/colors.ts`
  - palette labels, taglines, and theme colors
- `src/content/sections/confirm.ts`
  - confirm page iframe title and source URL
- `src/content/sections/admin.ts`
  - static admin informational copy

## Runtime Behavior

- Confirm CTA routes to `/confirm`.
- `/confirm` loads the external form iframe.
- No legacy iframe mirror runtime is used.

## Build

- Local dev: `npm run dev`
- Production build: `npm run build`
