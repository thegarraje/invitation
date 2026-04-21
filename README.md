# Panton Rebuild (Next.js)

Static/exportable Next.js rebuild with legacy Framer parity routes and a fullscreen confirm flow.

## Commands

- `npm run dev` - local development
- `npm run build` - build app (runs legacy `.htm` preparation first)
- `npm run export` - alias of build for static output
- `npm run typecheck` - TypeScript checks
- `npm run lint` - ESLint
- `npm run verify:routes` - route parity check against exported output
- `npm run verify:no-external` - runtime external-host reference guard
- `npm run compare:visual` - visual comparison script
- `npm run prune:assets` - dry-run report of unreferenced localized assets
- `npm run optimize:assets` - remove unreferenced localized assets

## Project Structure

- `src/app` - Next.js routes (App Router)
- `src/components/layout` - shell and route-level UI containers
- `src/components/sections` - reusable content sections
- `src/content` - route/content definitions and editable copy
- `src/lib` - runtime helpers (legacy mirror, motion presets, route normalization)
- `public/legacy-site` - legacy mirrored Framer HTML pages and custom patches
- `public/_local_assets` - localized runtime assets used by legacy mirrored pages
- `scripts` - build and verification scripts
- `config/route-paths.json` - canonical route/color parity map

## Content Editing

Use `CONTENT_EDITING.md` for the fastest path to update page text and CTA behavior.

## Notes

- This branch is configured for static export (`output: "export"`).
- Internal API/admin persistence routes are removed; `/admin` pages are static informational screens.
- Keep confirm flow paths stable (`/confirm/`) because legacy CTA patches point there.
