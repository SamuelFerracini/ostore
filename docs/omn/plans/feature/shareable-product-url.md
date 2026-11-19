# Shareable product URL (?product=id opens modal)

- Branch: `feature/shareable-product-url`
- Target: `main`
- Source: prompt

## Plan

## Problem

The product detail view is a global modal: `<ProductModal />` is mounted in `app/app.vue`, and its state lives in `app/composables/useProductModal.js` (`useState("productModal")`, with `open(p)` and `close()`). Opening the modal does not change the URL. If a customer copies the URL and shares it, the recipient sees the listing page, not the product.

## Goal

When a product modal is open, the URL carries the product id, for example `/products?category=rings&product=368611C00`. When someone opens that URL, the page loads and the modal opens for that product.

## Details

- Use a query param named `product` whose value is the product `id` from `public/products.json` (for example `368611C00`).

- `open(p)`: set `product=<p.id>` with `router.replace`, so each open does not add a history entry. Keep every other query param (`q`, `category`, `download`, sort, and so on).

- `close()`: remove only the `product` param with `router.replace`, and keep the rest.

- Deep link: when the app loads, or when the route's `product` query changes, and the param is set but no modal is open for that id:
  - Load products with `loadProducts()` from `app/composables/store.js`, which caches the result.
  - The data shape is `{ [shop]: { [category]: Product[] } }`. Find the first product whose `id` matches.
  - Ids repeat across categories, such as `all-sale`, `charms` and `clearance`. Duplicates are the same product, so the first match is fine.
  - If one is found, call `open(product)`.
  - If none is found, remove the param silently.

- Put this logic in one place, such as the composable or `ProductModal.vue`. Run it client-side only (`onMounted` or `watch` with `immediate`). Avoid SSR hydration mismatches.

- No loops: opening from the URL must not trigger a redundant router call or a flicker.

- Browser Back/Forward: if the `product` query disappears, close the modal. If it appears, open it.

- Do not touch the legacy `app/pages/product/[id].vue` page.

- Do not change the cart order-text link in `app/pages/cart.vue`. That is out of scope.

- Use **Claude in Chrome** (`--chrome`) to check the result in a real browser. Start the dev server yourself, or use the project's run script if one exists.

## Done when

- [ ] Opening a product from any card adds `product=<id>` to the URL, and the other params stay.

- [ ] Closing the modal removes `product` and leaves the rest of the URL unchanged.

- [ ] Pasting a URL with `?product=<id>` into a fresh tab loads the page with that product's modal open. Check this on `/products` and `/`.

- [ ] An unknown id loads the page normally, with no modal and no error, and the param is removed.

- [ ] Back/Forward behaves sanely, and nothing loops or flickers.

- [ ] `npm run build` passes.
