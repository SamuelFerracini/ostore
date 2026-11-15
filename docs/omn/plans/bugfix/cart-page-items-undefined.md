# Fix cart page 500 (cartItems undefined)

- Branch: `bugfix/cart-page-items-undefined`
- Target: `main`
- Source: prompt

## Plan

## Problem

Opening `/cart` (Nuxt dev server, http://localhost:3000/cart) gives a 500 error page:

```
500
Cannot read properties of undefined (reading 'length')
at Proxy._sfc_render (http://localhost:3000/_nuxt/pages/cart.js:212:27)
at renderComponentRoot (...runtime-core.esm-bundler.js:6484:16)
at hydrateSubTree (...runtime-core.esm-bundler.js:5272:32)
...
```

The error happens during client hydration. The only `.length` reads in the template of `app/pages/cart.vue` are `cartItems.length` (lines ~114 and ~119). `cartItems` is `computed(() => cartStore.getters.cartItems)` from the Vuex store in `stores/cart.ts`. So that getter returns `undefined` at render time.

## Leads (not confirmed)

- Two cart systems write the same `localStorage` key `'cart'`:
  - The Vuex store `stores/cart.ts`, used by `app/pages/cart.vue`, `app/app.vue`, `ProductModal.vue`, `ProductCard.vue`, `AppHeader.vue` and `Cart.vue`.
  - The legacy composables `app/composables/useCart.js` (`useState('cart')`) and `app/composables/useCheckout.js`, still used by `Cart.vue`, `Checkout.vue`, `PaymentSuccessful.vue`, `AppHeader.vue` and `app/pages/product/[id].vue`.
  - They can overwrite each other's data and shapes. Also check whether the `useState('cart')` Nuxt payload and the Vuex store collide.

- Check `app/app.vue` and any plugin that calls `loadCart` or commits to the store. Check whether the store state can end up without `items`, for example via SSR or HMR re-creating the module-level store.

- Recent commit `04b697d feat(cart): Thai-first Cinderella cart...` rewrote the cart page. Diff it for regressions.

## Goal

Find the real root cause and fix it. `/cart` must render with an empty cart, a filled cart, and stale or malformed `localStorage['cart']` data.

## Details

- Use Claude in Chrome to reproduce on http://localhost:3000/cart. Read the console and inspect `localStorage.cart` before and after adding items from the product modal. If the dev server is not running, start it from this worktree.

- Fix at the root, not just with `cartItems?.length`. A defensive guard is OK in addition to the real fix.

- If the legacy `useCart`/`useCheckout` composables are the cause, stop them clobbering the store's data. Use a separate key, or remove dead usages if they really are unused. Keep the change scoped. Do not rewrite unrelated components.

- Run the existing tests and lint if they exist.

## Done when

- [x] Root cause stated in the commit message.

- [x] Verified in Chrome: `/cart` loads with no 500 for an empty cart, after adding items, and after a hard reload.

- [x] Fix committed on this branch.
