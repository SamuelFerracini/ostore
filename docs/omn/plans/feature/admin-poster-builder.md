# Admin poster builder for product promo images

- Branch: `feature/admin-poster-builder`
- Target: `main`
- Source: prompt

## Plan

# Admin poster builder

## Problem

The admin makes promo posters by hand in Canva. A poster has a title, a subtitle, a 3-column grid of product photos with a price under each one, and footer text. The products are already in this Nuxt 3 store (`public/products.json`, rendered by `app/components/ProductCard.vue`). Building the poster in Canva is slow.

## Goal

In admin mode, the admin picks products in the store and gets a ready poster PNG to download.

## Details

- Admin mode already exists: `app/composables/useAdmin.js` returns `isAdmin` (cookie `ostore_admin`, set by `?admin=1`). Reuse it. Show nothing new to customers.

- **Selection**: in admin mode, each `ProductCard` shows a select checkbox/toggle. Keep the selection in a new composable (`usePosterSelection`). Persist it in localStorage so it survives navigation between categories. Keep the selection order. Store enough product data (id, name, primaryImage, price_normalised) to render the poster without a reload.

- A floating bar appears when 1 or more products are selected: "Poster (N)", "Clear", and a link to the builder page.

- **Builder page** `app/pages/admin/poster.vue`: show it only when `isAdmin`, otherwise redirect to `/`.
  - Editable fields: title, subtitle, footer lines (multi-line), a small top-right credit line (default "ดูเพิ่มเติมที่ FB: Nonlapan Saisuwan"). Remember the last values in localStorage.
  - Product list: reorder (up/down or drag), remove, and an optional price-label override per item (e.g. "Platinum 2,550 บาท / Silver 2,750 บาท"). The default label is the 🇦🇺 flag plus the THB price (`price_normalised`), formatted like `1,870 บาท`, rounded the same way as `formatPrice` in ProductCard.
  - Live preview: white background, a large soft pink circle behind the grid, a 3-column grid of square tiles with a light grey background and the product image (`primaryImage`), the price centred under each tile, a bold Thai title, and an outlined bold footer. Size presets: 1080×1350 (feed) and 1080×1920 (story). Rows grow with the item count. Use a Thai-capable Google Font, e.g. Kanit or Prompt. Scale the preview to fit the screen, and export at full size.
  - "Download PNG" exports the preview at full resolution.

- **CORS**: product images come from other hosts (au.pandora.net and others), which would taint the canvas. Add a Nuxt server route `server/api/img.get.ts` that proxies the image. Allow only the image hosts found in products.json (an allowlist). Do not allow open proxying. Use the proxied URLs in the preview. Export with `modern-screenshot` or `html-to-image` (pin an exact version). Wait for images and fonts to load before export.

- Add the new UI strings to `app/locales/en.js` and `th.js`.

- Use the frontend-design plugin for the poster and builder look. Use Claude in Chrome to check selection, the preview and the PNG download. Start the app with `npm run dev` in this worktree.

## Done when

- [ ] Non-admin users see no change, and `/admin/poster` redirects them to `/`.

- [ ] An admin can select products across pages, edit the texts, reorder, and download a PNG that matches the preview, with all product images present.

- [ ] The image proxy rejects hosts not on the allowlist.

- [ ] `npm run build` passes.
