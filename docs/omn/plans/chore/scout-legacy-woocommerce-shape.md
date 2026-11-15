# Scout: map leftover WooCommerce product shape usage

- Branch: `chore/scout-legacy-woocommerce-shape`
- Target: `main`
- Source: prompt

## Plan

# Scout: map leftover WooCommerce product shape usage

## Problem

The Nuxt 3 storefront (`app/`) now gets its products from `public/products.json`. Each product has: `shop`, `id`, `name`, `price`, `originalPrice`, `salePrice` (strings like "$68.00"), `primaryImage`, `hoverImage`, `link`, `sizes [{value, available}]`, `categories`, `price_normalised`, `market_thb` and `originalPrice_normalised`.

Several files still read an old WooCommerce/GraphQL shape: `image.sourceUrl`, `galleryImages.nodes`, `slug`, `sku`, `databaseId`, `allPaStyle.nodes`, `variation.node.*`, `regularPrice`, `stockStatus`. Examples:

- `app/pages/product/[id].vue` (uses `getProduct(slug, sku)` from `app/composables/store.js`)

- `app/pages/categories.vue`

- `app/components/ImageSliderWithModal.vue`

- the search suggestions in `app/components/AppHeader.vue` (around lines 260–300)

- `app/components/Cart.vue` and `app/components/Checkout.vue` (`product.variation.node.*`)

The wishlist is being fixed separately. Don't investigate `useWishlist`, `favorites.vue` or `ButtonWishlist.vue`.

## Goal

Find out what is dead code and what is live but broken, so we can plan the cleanup. **Read-only: don't change code.**

## What to find out

1. Every file and line that reads the old shape (grep for the fields above and for `getProduct`, `searchProducts`, `useComponents`, the vuex `cart` store vs `useCart`, `useCheckout`).

2. For each, whether it is **reachable**:
   - Is the page linked from anywhere?
   - Is the component mounted?
   - Does the composable call a live API? Check `storefront.config.js`, `nuxt.config.ts`, `.env.example` and `server/api/`.

3. Run `npm run dev` and try the reachable ones: `/product/<something>`, `/categories`, typing in the header search, the header mini cart, checkout. Note errors from the console and server log.

4. For each item, recommend **delete**, **port to the products.json shape** (and what it should become), or **leave as is**.

5. Flag anything that blocks the parallel branches `feature/cart-redesign` (owns `Cart.vue`, `Checkout.vue`, `cart.vue`) and `feature/cinderella-theme-shell` (owns `AppHeader.vue`, `product/[id].vue`, `categories.vue`).

## Done when

A table of file:line → field used → reachable? → observed behaviour → recommendation, plus a short proposed cleanup plan. Results saved with save_note.
