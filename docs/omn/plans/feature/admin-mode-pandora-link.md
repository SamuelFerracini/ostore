# Admin mode via ?admin=1 to show Pandora links

- Branch: `feature/admin-mode-pandora-link`
- Target: `main`
- Source: prompt

## Plan

# Admin mode via `?admin=1`

## Problem

The Nuxt 3 storefront (`app/`) shows a "View on Pandora website" link (`t("modal.viewPandora")`) to every customer. Shop customers should not see the Pandora source URL. Only the shop admin should.

Link locations, both gated today only by `v-if="product.link"`:

- `app/components/ProductCard.vue` (~line 251)

- `app/components/ProductModal.vue` (~line 477)

## Goal

Add a simple admin mode toggled by a URL query param. Pandora links show only in admin mode.

## Details

- New composable `app/composables/useAdmin.js` exposing `isAdmin` (a reactive boolean).

- `?admin=1` in the URL turns admin mode on. `?admin=0` turns it off.

- Make it sticky so it survives navigation (router pushes like the product modal's `?product=` query in `app/composables/useProductModal.js` drop or rewrite the query). Store the flag in `localStorage` (wrap in try/catch) or a cookie via `useCookie`. Prefer `useCookie` (key e.g. `ostore_admin`) so SSR and client agree and there is no hydration mismatch.

- Watch `route.query.admin` so changing the param at runtime updates the flag.

- Change both links to `v-if="isAdmin && product.link"`.

- Check `app/pages/product/[id].vue` and any other place for Pandora product links; gate them the same way. Do not touch the Pandora logo or footer shop branding (`AppFooter.vue`, `ShopLogo.vue`); that is not the product URL.

- This is a UI toggle, not security: `product.link` stays in `public/products.json`. Do not add auth.

- No visible "admin" badge needed.

## Testing

Run `npm run dev`. Use Claude in Chrome to check:

1. `/products` without the param: no Pandora link on cards or in the product modal.

2. `/products?admin=1`: links visible on cards and modal.

3. Open a product modal, close it, navigate to another page: links still visible.

4. `?admin=0`: links hidden again.

## Done when

- [ ] Pandora links hidden by default, shown with `?admin=1`, persist across navigation, cleared with `?admin=0`.

- [ ] No hydration warnings in console.

- [ ] Changes committed on the branch.
