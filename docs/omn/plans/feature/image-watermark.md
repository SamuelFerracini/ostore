# Watermark product images with Nonlapan Facebook

- Branch: `feature/image-watermark`
- Target: `main`
- Source: prompt

## Plan

## Problem

Other sellers screenshot product pictures from the Nonlapan store and advertise them as their own. Product images are hotlinked from Pandora (`au.pandora.net`, via `resizeImage` in `app/utils/productImage.js`). They are not ours, so we must **not** alter, proxy or re-encode the image files.

## Goal

Show a visible watermark over product images in the browser, so any screenshot carries Nonlapan branding and points people to the Facebook page `https://www.facebook.com/nonlapan.ssw` (the same URL is in `app/components/AppFooter.vue:21`).

## Details

- Build one reusable component, for example `app/components/ImageWatermark.vue`. It is an absolutely positioned overlay inside the image's container, with `pointer-events: none` so clicks, hovers and swipes still reach the image.

- Content: the Nonlapan logo (`public/logo.png`, or the existing wordmark/logo component if one fits better) plus the text `fb.com/nonlapan.ssw`. Use semi-transparent white with a soft shadow so it reads on light and dark photos without hiding the product. Pick between a corner badge and a subtle diagonal tile, whichever looks better. It must survive a cropped screenshot of the main image.

- Scale it per context: small on cart thumbnails, medium on product cards, larger on the modal/detail image.

- Apply to:
  - product cards: `app/components/ProductCard.vue` (both primary and hover images) and any grid pages that render product images (`app/pages/categories.vue`, favorites)
  - product modal/detail: `app/components/ProductModal.vue` main images (thumbnails optional), and the product detail page under `app/pages/product/` if it shows images
  - cart thumbnails: `app/components/Cart.vue` and `app/pages/cart.vue`

- Do **not** add it to the admin poster builder (`app/pages/admin/poster.vue`, `PosterCanvas.vue`, `PosterBar.vue`) or to non-product images such as logos and `PromotionsPaused.vue`.

- Do not touch `server/api/img.get.ts` and do not add any server-side image processing.

- Keep `alt`, lazy loading, `@error` fallbacks and existing layout and aspect ratios unchanged.

## Tools

- **Claude in Chrome**: once the app runs (`npm run dev`), open /products, a product modal and /cart. Check the watermark looks right at phone and desktop widths and that clicks still go through.

## Done when

- [ ] The watermark shows on product cards, the product modal/detail view and cart thumbnails, and nowhere else.

- [ ] Image files and URLs are unchanged. No server image processing was added.

- [ ] Card clicks, hover image swap, modal swiping and wishlist buttons still work.

- [ ] `npm test` passes.
