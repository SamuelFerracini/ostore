# Sale pill first, drop authentic trust item

- Branch: `chore/sale-first-remove-authentic`
- Target: `main`
- Source: prompt

## Plan

## Problem

The header category pills show Sale last. The products page trust strip shows an "Authentic, shopped from Australia" item that the owner no longer wants.

## Goal

1. Make the Sale pill the first pill, before "All".

2. Remove the "Authentic, shopped from Australia" trust item.

## Details

- `app/composables/useCategoryLabels.js`: in `CATEGORY_PILL_IDS`, move `{ id: "all-sale", sale: true }` to the top of the array. The new order is Sale, All, Rings, Charms, Bracelets, Necklaces, Earrings. Update the comment above the array if it needs it.

- `app/pages/products.vue` (around line 131): delete the first `<li>` in the desktop trust strip. That `<li>` holds the shield SVG and `{{ t("products.authentic") }}`. Keep the "included" and "receipt" items.

- Remove the now-unused `products.authentic` key from `app/locales/en.js` and `app/locales/th.js`. First grep to confirm nothing else uses the key.

- Do NOT touch the mobile line `products.authenticShort` ("Authentic from Australia · Gift box and bag included"). Do NOT touch `footer.line1`. These are separate strings.

## Done when

- [x] Sale is the first pill in the header carousel.

- [x] The desktop trust strip shows only the two remaining items.

- [x] `products.authentic` has no remaining references.

- [x] The build or lint passes.
