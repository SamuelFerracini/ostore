# Client-side performance pass

- Branch: `feature/client-perf-pass`
- Target: `main`
- Source: prompt

## Plan

# Client-side performance pass

## Problem

The Nuxt 3 storefront feels slow. It has no backend: everything runs in the browser, and that must stay true. Do **not** add a server API or Nitro routes.

- `public/products.json` is 8.0 MB (522 KB gzipped). `app/composables/store.js` `loadProducts()` fetches and parses all of it before any product shows.

- `stores/cart.ts` (around line 30) fetches `/products.json` a **second time** to validate the cart.

- The `pandora.all-sale` category holds 1,601 entries that mostly repeat products already in the other categories (charms 882, bracelets 189, rings 291, necklaces 210, earrings 159, gift-sets 103, other 7). Each product is about 2 KB and includes fields the grid never uses (`scrapedAt`, the full `images` array).

- `app/components/ProductCard.vue` (around lines 155-172) renders two `NuxtImg` per card, the hover image and the primary image. The grid therefore downloads double the images, even on touch devices.

- Images come from Pandora's demandware CDN (`https://au.pandora.net/dw/image/v2/...`) at full size. This CDN accepts `sw=` / `sh=` resize query params.

- `app/pages/products.vue` `countProducts()` runs `searchProducts` again with `perPage: Number.MAX_SAFE_INTEGER` on every query change, repeating the full filter and sort only to get a count.

- `public/products.backup-*.json` (4.1 MB and 256 KB) ship with every deploy and are publicly reachable.

## Goal

Cut the first-load data and image weight sharply. Every feature keeps working exactly as today: search, category, price filter, sort, infinite scroll, modal, product page, cart, wishlist/favorites, admin links.

## Details

1. **Split the data with a build script.** Add a Node script in `scripts/`, for example `scripts/build-product-index.mjs`, plus an npm script for it. Read the scraped `public/products.json` and write:
   - `public/products-index.json`: each product **once**, with only the fields the card, grid, filters, sort, cart and wishlist need. Read `ProductCard.vue`, `useWishlist.js`, `stores/cart.ts`, `useAdmin.js` and the pages to find them. `sizes` is used on the card (available count), so check before dropping it. Each category maps to an ordered list of ids, so `all-sale` stops repeating whole products.
   - Detail data (`images`, plus anything else only the modal or product page needs), loaded on demand: one file per product, or one per category, whichever you judge better. Explain the choice in the commit.
   - Keep the raw `products.json` as the scraper output and the script's input. The app must no longer fetch it. Keep `scripts/fix_products.js` and `compare-products.mjs` working on the raw file.

2. **Update the data layer.** Make `app/composables/store.js` load the index once, cached, keeping category order and the dedupe logic. Make `useProductModal.js`, `ProductModal.vue` and `app/pages/product/[id].vue` fetch detail on demand. Make `stores/cart.ts` validate against the shared cached index instead of fetching on its own. Search, filter and sort stay client-side.

3. **Request smaller images.** Add one helper that sets `sw`/`sh` on demandware URLs: about 400 px for cards, larger for the modal. Leave non-demandware URLs untouched.

4. **Load hover images on demand.** Render the hover `NuxtImg` only after the first `mouseenter` on a card, or only under `(hover: hover)`. Touch devices must not download it.

5. **Return the count from the same search.** Change `searchProducts` to return `{ items, total }`, or add a cheap count path, and remove the `MAX_SAFE_INTEGER` call in `products.vue`. Update every caller, including `AppHeader.vue` search.

6. **Move the backups out of `public/`.** Move `public/products.backup-*.json` into a git-ignored folder outside `public/`, for example `data/backups/`, and add it to `.gitignore`. Do not delete them.

Use the **Claude in Chrome** browser to check the running app: run `npm run dev` in this worktree, then check the network tab, the grid, hover images on desktop, the modal gallery, the product page, add to cart, reload with items in the cart, and favorites.

## Done when

- [ ] On `/products`, no request goes to `/products.json`. Report the before and after size of the first data download in the final message.

- [ ] Card images request resized URLs, and hover images load only on hover-capable or hovered cards.

- [ ] `countProducts` no longer runs a full second search.

- [ ] Backups are outside `public/` and git-ignored.

- [ ] Search, category, price filter, sort, infinite scroll, modal, product page, cart validation, favorites and admin links all work in the browser.

- [ ] `npm run build` passes.

- [ ] Commits on the branch, with the plan's checks ticked.
