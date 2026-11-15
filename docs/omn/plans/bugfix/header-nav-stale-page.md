# Fix header nav stuck on Favorites when going to Cart

- Branch: `bugfix/header-nav-stale-page`
- Target: `main`
- Source: prompt

## Plan

## Problem

In the Nuxt 3 storefront (`compatibilityVersion: 4`, source in `app/`), the header has two buttons at the top right: Favorites (`/favorites`) and Cart (`/cart`). Both are defined in `app/components/AppHeader.vue`. When the user is on `/favorites` and clicks the Cart button, the URL changes to `localhost:3000/cart` but the page still shows the Favorites page ("รายการโปรด" heading with the empty-state heart). The old page is not replaced. The user may also see the reverse: Cart content staying after going to Favorites.

The user confirmed this is a real bug. In their screenshot Chrome's Google Translate was active. Translate replaces text nodes with `<font>` elements and is known to break Vue DOM patching (`NotFoundError: Failed to execute 'insertBefore'/'removeChild'`). Treat that as one hypothesis only. First check whether the bug also happens with Translate off.

Files to know:

- `app/components/AppHeader.vue`: header links. It also has an `onClickOutside` and a `cartModal`/`Cart` dropdown.

- `app/pages/cart.vue`, `app/pages/favorites.vue`

- `app/app.vue`: `<NuxtPage />` inside `<main>`. No layouts and no page transitions.

- `app/components/ProductCard.vue`, `app/components/EmptyCart.vue`, `stores/cart.ts`, `app/composables/useWishlist.js`

## Goal

Clicking Cart or Favorites in the header always renders the matching page, in both directions, from any page.

## Details

- Use **Claude in Chrome** to reproduce on the dev server. Test with Translate off and also with Chrome's translate-to-English on. Read the console for errors during navigation, such as a Vue render error in the cart page setup that leaves the old page mounted, or a hydration error. Find the real root cause before you change anything.

- Look for render or setup errors in `cart.vue`. For example, `getCategoryName` is used there but is never imported or defined. Check whether it is auto-imported. Also check that `NuxtImg` gets valid data and that the cart store getters work.

- If Translate turns out to be the cause, make the app survive it. Add a client-only Nuxt plugin that patches `Node.prototype.removeChild`/`insertBefore` so a node whose parent has changed does not throw. Do not block translation with `translate="no"`.

- Keep the fix as small as possible and limit it to the cause. Do not restyle anything.

## Done when

- [x] Navigating Favorites → Cart → Favorites from the header shows the correct page every time, with Translate on and off, and the console shows no errors.

- [x] Root cause and fix summarised in the commit message.

- [x] Changes committed on the branch.
