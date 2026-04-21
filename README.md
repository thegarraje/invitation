# AMB Invitation Site (Native Static Next.js)

Fully static Next.js rebuild with native Framer Motion animations and route parity.

## Commands

- `npm run dev` - local development
- `npm run build` - static production build
- `npm run export` - alias of build for static output
- `npm run typecheck` - TypeScript checks
- `npm run lint` - ESLint
- `npm run verify:routes` - route parity check against exported output
- `npm run verify:no-external` - runtime external-host reference guard
- `npm run compare:visual` - optional visual comparison script

## Project Structure

- `src/app` - Next.js App Router pages
- `src/components/layout` - page shell, transitions, media background, bottom nav
- `src/components/sections` - reusable scene sections
- `src/content` - centralized editable copy and route composition
- `src/lib` - motion presets and route normalization helpers
- `public/assets` - brand assets used by runtime
- `scripts` - verification and comparison scripts
- `config/route-paths.json` - canonical route/color parity map

## Notes

- Native static rendering only (no legacy iframe mirror).
- `/confirm` intentionally embeds the external forms.app page.
- Admin pages are static informational screens in this branch.
