# Remove dead code

- Branch: `chore/remove-dead-code`
- Target: `main`
- Source: prompt

## Plan

## Problem

The `ostore` repo (Nuxt 3 storefront: `app/`, `server/`, `stores/`, root scripts) has collected dead code over time. Unused code makes the project harder to read and maintain.

## Goal

Find and remove dead code without changing app behavior.

## Details

- Nuxt auto-imports components (`app/components/**`, including `Logos/` with a `Logos` prefix, e.g. `<LogosShopLogo>`), composables (`app/composables/*`) and pages. A file with no explicit `import` is not proof it is unused. Grep for the tag names (PascalCase and kebab-case) and for function names.

- Check for:
  - unused components, composables, exported functions and store modules (`stores/cart.ts`, `stores/website.ts`, `app/composables/store.js`)
  - unused imports, variables, functions, commented-out code blocks and unreachable branches inside files
  - unused `server/api/*` routes (grep for the call path)
  - unused config files (e.g. `storefront.config.js`)
  - unused dependencies in `package.json` (e.g. check whether `vuex`, `axios`, `dayjs`, `swiper`, `primevue`/`primeflex`/`primeicons`, `@vueuse/*` are really used). Update `package-lock.json` with `npm uninstall` if you remove any.

- Do NOT delete without asking in your final report: one-off data scripts (`compare-products.mjs`, `scripts/fix_products.js`) and `public/products.json`. List them as candidates instead.

- Keep behavior identical. No refactors beyond removal.

- Commit in small logical commits (components, composables/stores, deps, in-file cleanup).

## Done when

- [ ] `npm run build` passes.

- [ ] `npm run dev` starts and the main pages (`/`, `/products`, `/product/[id]`, `/cart`, `/categories`, `/favorites`, `/tracking`) render without console errors.

- [ ] Final report lists every removed file, symbol and dependency, plus the evidence it was unused, plus any candidates you left in place.
