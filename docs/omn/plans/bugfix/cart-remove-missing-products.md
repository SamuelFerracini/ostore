# Remove cart items missing from products.json everywhere

- Branch: `bugfix/cart-remove-missing-products`
- Target: `main`
- Source: prompt

## Plan

## Problem

A cart saved in localStorage (`cart` key) can hold products that no longer exist in `public/products.json`. Some cleanup already exists, but there are gaps:

- `stores/cart.ts` has `validateCartItems`. It checks the cart against `loadProducts()` from `app/composables/store.js`, which reads `public/products-index.json`. `scripts/build-product-index.mjs` builds that file from `products.json`. Items that are not found get dropped and the cart is saved again.

- `app/app.vue` runs `cartStore.dispatch("loadCart")` in `onMounted`, but only after `if (promotionsPaused.value) return;`. When promotions are paused, the check never runs.

- `app/composables/useCart.js` keeps its own copy of the cart. It reads the same `cart` localStorage key into `useState('cart')`. `AppHeader.vue` (the badge), `Checkout.vue` and `useCheckout.js` use that copy. It never sees the cleaned list, so removed products stay in the header count and in checkout until the next reload. Depending on mount order, they can stay longer.

- IDs are compared with a `Set` and `has()`, which is type-sensitive. A number ID stored in the cart will not match a string ID in the index.

## Goal

Any cart item whose `id` is not in the product index gets removed from localStorage and from every place that shows the cart: the Vuex store, the `useCart` state, the header badge, the cart page and checkout.

## Details

- Compare IDs as strings on both sides.

- Make the validation run on every app load, including when promotions are paused. Keep the scroll-listener early return as it is.

- After validation removes items, update the `useCart` `useState('cart')` too. One way: export the validation (or a `pruneMissingProducts(items)` helper) and call it from `useCart`'s `onMounted` as well. Another way: have `loadCart` write the cleaned list into that shared state. Pick the simpler one. Both copies must end up the same.

- Keep the existing behaviour when the index fetch fails: keep the cart unchanged and do not wipe it.

- `loadProducts` is cached, so this must not add a second fetch.

- Do not change `products.json` or the index build script.

## Done when

- [ ] A cart in localStorage with one valid ID and one unknown ID shows only the valid item after reload: header badge, cart page and checkout all agree, and localStorage is rewritten.

- [ ] The same is true with promotions paused.

- [ ] A cart item with a number `id` that matches a string ID in the index is kept.

- [ ] If the index fetch fails, the cart stays unchanged.

- [ ] Existing tests pass (`npm test` or the project's test command). Add a unit test for the pruning helper if there is a test setup.
