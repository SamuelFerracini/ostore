# Wishlist: key on product id, rebuild favorites page

- Branch: `bugfix/wishlist-product-id`
- Target: `feature/cinderella-theme-shell`
- Source: variation

## Plan

# Wishlist: key on product id, rebuild favorites page

## Problem

`app/composables/useWishlist.js` matches products on `product.databaseId`, a field from an old WooCommerce product shape. Storefront products (from `public/products.json`) have no `databaseId`; they have `id`, `name`, `primaryImage`, `hoverImage`, `price_normalised`, `market_thb`, `originalPrice_normalised`, `categories`, `sizes` and `link`. So `undefined === undefined`: once anything is saved, every product shows as wishlisted.

- `app/components/ButtonWishlist.vue` passes raw products, so it has the same bug.

- `app/pages/favorites.vue` reads `image.sourceUrl`, `slug`, `sku`, `salePrice` and `allPaStyle.nodes[0]`, so it crashes for real products.

- The product modal (branch `feature/product-modal`) works around this by passing `{...product, databaseId: product.id}`.

This branch is nested on `feature/cinderella-theme-shell`, which is restyling the app (Cinderella theme: Tailwind tokens `ivory`, `royal`, `navy`, `gold`, `gold-text`, `gold-line`, `muted`, `midnight`; Thai-first copy). It owns `favorites.vue`, `ButtonWishlist.vue` and the wishlist hearts on `ProductCard.vue`. Build on that branch's current code and style.

## Goal

The wishlist works with storefront products, and the favorites page renders them in the new design.

## Details

- **Rewrite `useWishlist`:**
  - Shared state through `useState('wishlist')`, so every heart (card, modal, favorites) stays in sync.
  - Key on `id`.
  - Store a small record: `{ id, name, primaryImage, hoverImage, price_normalised, market_thb, originalPrice_normalised, categories, sizes, link, shop }`.
  - API: `isWishlisted(id)` (or a computed per product), `toggleWishlist(product)`, `removeFromList(id)`, `wishlist`.
  - Guard every `localStorage` access with try/catch, and stay SSR-safe.
  - On load, drop legacy entries that have no `id`.
  - Stay compatible with callers that pass `{...product, databaseId}`: use `product.id ?? product.databaseId`.

- **Update `ButtonWishlist.vue` and the card heart.** Use the Thai aria-labels "เพิ่มในรายการโปรด" / "ลบออกจากรายการโปรด" and `aria-pressed`. A filled heart in `royal` when active.

- **Rebuild `favorites.vue`** on `ProductCard` (the same grid as the product list):
  - H1 "รายการโปรด" + "N ชิ้น".
  - Empty state: "ยังไม่มีรายการโปรด", with a gold pill "เลือกซื้อสินค้า" linking to `/products`.
  - Removing via the heart updates the list immediately.

- **Don't touch** `ProductModal.vue`, `stores/cart.ts` or the cart files; other units own them.

## Done when

- [ ] Toggling the heart on one product affects only that product.

- [ ] The favorites page lists the saved products and works with an old localStorage wishlist (old entries are dropped, nothing crashes).

- [ ] `npm run build` passes.

- [ ] Checked with **Claude in Chrome** against `npm run dev` in this worktree: toggle on 2 products, reload, open favorites, remove one, at 1440px and 390px. Results saved with save_note.
