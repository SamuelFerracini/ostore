# Crown favicon for browser tab

- Branch: `feature/crown-favicon`
- Target: `main`
- Source: prompt

## Plan

## Problem

The site has no favicon. The browser tab shows a default icon. `nuxt.config.ts` sets no icon in `app.head.link`.

## Goal

Show the header crown as the tab icon.

## Details

- Crown source: inline SVG in `app/components/AppHeader.vue` (around line 109). viewBox `0 0 48 32`, stroke-only (`stroke="currentColor"`, `stroke-width="1.6"`, round caps/joins), color class `text-gold` / `dark:text-night-gold`. Look up the real `gold` hex in `tailwind.config.ts`.

- Create `public/favicon.svg`: same paths, square viewBox (pad/centre the 48x32 crown, e.g. `0 -8 48 48`), hard-coded gold stroke. Thicken the stroke (about 2.5-3) so it reads at 16px. Optionally use a `prefers-color-scheme: dark` media query in the SVG for the night gold.

- Create `public/favicon.ico` (16, 32, 48 sizes) and `public/apple-touch-icon.png` (180x180, crown on a solid navy or white background) rendered from the SVG. Use any tool available locally (e.g. `rsvg-convert`, ImageMagick, or a one-off node script with `sharp` run via npx). Do not add a runtime dependency to package.json.

- Add to `app.head.link` in `nuxt.config.ts`:
  - `{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }`
  - `{ rel: "icon", href: "/favicon.ico", sizes: "any" }`
  - `{ rel: "apple-touch-icon", href: "/apple-touch-icon.png" }`

- Keep the existing font links unchanged.

## Done when

- [ ] `public/favicon.svg`, `public/favicon.ico`, `public/apple-touch-icon.png` exist and show the crown.

- [ ] `nuxt.config.ts` links them.

- [ ] `npm run build` passes.

- [ ] Changes committed on this branch.
