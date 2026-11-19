# Obvious admin mode banner with Exit admin button

- Branch: `feature/admin-mode-exit-banner`
- Target: `main`
- Source: prompt

## Plan

## Problem

Admin mode in this Nuxt storefront is turned on with `?admin=1` and kept in the `ostore_admin` cookie (`app/composables/useAdmin.js`). Admin-only pages use `app/middleware/admin.js` (e.g. `app/pages/admin/poster.vue`). When admin mode is on, nothing clearly says so, and the only way out is typing `?admin=0` in the URL.

## Goal

When admin mode is on, make it very obvious and give a one-click **Exit admin** button.

## Details

- Add a visible admin indicator shown on every page only when `isAdmin` is true. Suggested: a slim sticky bar at the very top (above `AppHeader`), high-contrast colour clearly different from the store theme, text like "Admin mode", plus an **Exit admin** button. Mount it in `app/app.vue` (or the layout) so it covers all pages, including `/admin/*`.

- Add an `exit()` (or `setAdmin(false)`) function to `useAdmin` that sets the cookie to `"0"`. Keep the composable as the single source of truth.

- On exit:
  - Remove `admin` from the current URL query (use `router.replace`), otherwise a reload with `?admin=1` turns admin back on.
  - If the current route is under `/admin/`, navigate to `/`.

- Admin-only UI (PosterBar, picks on ProductCard/ProductModal) must hide right away after exit, without a reload.

- Make sure the bar does not overlap the header or the floating `PosterBar`, and works at phone width.

- All user-facing text goes through `useLocale().t`; add keys for every locale the app has.

- No SSR/hydration mismatch: the bar renders from the cookie the same on server and client.

## Done when

- [ ] With `?admin=1`, a clear admin bar shows on store pages and `/admin/poster`.

- [ ] Clicking **Exit admin** hides the bar and all admin UI, strips `?admin` from the URL, and leaves `/admin/*` for `/`.

- [ ] Reloading after exit stays out of admin mode.

- [ ] Checked in the browser with Claude in Chrome (desktop and phone width). Use it to open the running dev app and click through the flow. Start the app yourself with the project's dev script; do not wait for the user.

- [ ] Build/lint pass.
