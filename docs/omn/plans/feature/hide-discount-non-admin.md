# Hide discount badge and compare price for non-admins

- Branch: `feature/hide-discount-non-admin`
- Target: `main`
- Source: prompt

## Plan

## Problem

Customers (non-admins) see the discount badge (for example "−22%") and a struck-through comparison price ("Regular price" or "Thai shop price"). The owner wants these hidden from customers for now. Admins still see them.

## Goal

Comment out (do not delete) the discount and comparison-price UI for non-admins. Keep it visible when `isAdmin` is true. Admin mode comes from `app/composables/useAdmin.js` (`const { isAdmin } = useAdmin();`).

## Details

Gate each item with `isAdmin` and leave a short code comment saying it is hidden for customers on purpose, so it is easy to turn back on. Keep the existing computed helpers (`comparePrice`, `discountPercent`, `reference`, `saving`, `percent`, `referencePrice`, `savings`).

- `app/components/ProductCard.vue`
  - `−{{ discountPercent(product) }}%` badge (~line 196): show only for admins.
  - Compare price line `comparePrice(product).label <s>…</s>` (~line 267): show only for admins. This covers both "Regular price" and "Thai shop price".

- `app/components/ProductModal.vue` (already has `isAdmin`)
  - `−{{ percent }}%` badge (~line 367): admins only.
  - `reference.label <s>…</s>` line (~line 393): admins only.
  - "Save X ฿" pill `t("modal.save", …)` (~line 398): admins only.

- `app/pages/cart.vue` (add `const { isAdmin } = useAdmin();` if missing)
  - Per-item `referencePrice(item).label <s>…</s>` (~line 173): admins only.
  - "You save … vs. regular price" total `t("cart.saved", …)` (~line 259): admins only.

- Do not touch `app/pages/product/[id].vue` (legacy page).

- Do not change locale strings.

## Done when

- [ ] As a customer (no `ostore_admin` cookie, or `?admin=0`), cards, modal and cart show no % badge, no struck-through compare price, no "Save" pill, no "You save" total.

- [ ] With `?admin=1`, all of them show as before.

- [x] Build and existing tests pass.

- [x] Changes committed on the branch.
