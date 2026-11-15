# Fix product modal wishlist heart always filled

- Branch: `bugfix/product-modal-wishlist-state`
- Target: `main`
- Source: prompt

## Plan

## Problem

The wishlist heart button in `app/components/ProductModal.vue` (around line 434) always shows filled red, even for products that are not in the wishlist.

Cause: commit `e78f07b` changed `app/composables/useWishlist.js`. Its `isWishlisted` is now a function `isWishlisted(idOrProduct)`, not a ref. The modal (around line 138) still calls `useWishlist({ get databaseId() {...} })` and uses `isWishlisted` in the template as a boolean. A function is always truthy, so the icon is always `i-iconamoon-heart-fill` with the red class, and `aria-pressed` is wrong too.

## Goal

Make the heart show outline when the product is not wishlisted, and filled red when it is. Clicking it toggles the state.

## Details

- Follow the pattern in `app/components/ButtonWishlist.vue`: call `useWishlist()` with no argument, then `const active = computed(() => isWishlisted(product.value?.id))`.

- Use `active` in the template for the icon name, the red class, `aria-pressed`, and `aria-label`.

- Keep `onWish` working. `toggleWishlist` keys on `product.id ?? product.databaseId`, so passing `product.value` is enough. Drop the `databaseId` spread if it is no longer needed.

- Do not change `useWishlist.js`.

- Use Claude in Chrome to open a product modal. Check that the heart is outlined at first, fills red on click, and goes back to outline on a second click. Check that the state matches the heart on the product card and the favorites page.

## Done when

- [ ] The heart reflects the real wishlist state and toggles on click.

- [ ] The modal and the card heart stay in sync.

- [ ] The change is committed on this branch.
