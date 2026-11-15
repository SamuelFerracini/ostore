# Remove order tracking page and link

- Branch: `chore/remove-order-tracking`
- Target: `main`
- Source: prompt

## Plan

## Problem

The store has an order tracking feature that we are not shipping now. It must be removed from the app.

## Goal

Delete the tracking page and every user-facing link/text pointing to it.

## Details

- Delete `app/pages/tracking/index.vue` (the `/tracking` route). Remove the `app/pages/tracking/` folder if empty.

- In `app/components/AppFooter.vue` (~line 95-101), remove the whole `<NuxtLink to="/tracking">` block, including its delivery icon and the Thai label `ติดตามคำสั่งซื้อ` ("track order"). Keep the rest of `.footer-actions` (dark mode toggle etc.) intact and check layout still looks fine.

- Grep the repo (excluding `docs/` and node_modules) for `/tracking`, `tracking/`, and `ติดตามคำสั่งซื้อ` to confirm nothing else references it.

- Do NOT touch:
  - Tailwind `tracking-[...]` classes (letter-spacing) in `AppHeader.vue`, `Checkout.vue` etc.
  - `::-webkit-scrollbar-track` CSS.
  - `app/components/PromotionsPaused.vue` text `ติดตามโปร` ("follow promotions" in the Line group) — unrelated.
  - Plan docs under `docs/omn/plans/`.

## Done when

- [x] `/tracking` page file is gone and no code links to it.

- [x] Footer renders without the tracking link.

- [x] Build/typecheck (`npm run build` or project equivalent) passes.

- [x] Changes committed on the branch.
