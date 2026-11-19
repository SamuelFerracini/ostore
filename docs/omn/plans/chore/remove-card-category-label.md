# Remove category label from product card

- Branch: `chore/remove-card-category-label`
- Target: `main`
- Source: prompt

## Plan

## Problem

Product cards show a gold category label under the price (for example "Charms" on a charm card). The user does not want it.

## Goal

Remove the category label from product cards. Keep the ring meta line ("N sizes" / ring label) that the same slot shows for rings.

## Details

- `app/components/ProductCard.vue`: `metaLine(product)` (around line 117) returns ring meta for rings and `productTypeLabel(product)` otherwise. Make non-ring products show nothing, and do not render the meta element at all when the value is empty (no empty gap left under the price).

- Remove the `useCategoryLabels()` / `productTypeLabel` import from `ProductCard.vue` if it becomes unused.

- Do not remove `productTypeLabel` from `app/composables/useCategoryLabels.js` if other code uses it; delete it only if nothing else references it.

- Do not change locale files.

## Done when

- [x] Non-ring product cards show no category text and no leftover gap.

- [x] Ring cards still show their sizes line.

- [ ] App builds and existing tests/lint pass.

- [ ] Change committed on the branch.
