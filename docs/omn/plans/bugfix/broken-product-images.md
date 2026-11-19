# Fix broken product images on Pandora shop

- Branch: `bugfix/broken-product-images`
- Target: `main`
- Source: prompt

## Plan

# Fix broken product image on Pandora shop

## Problem

On `http://localhost:3000/products/?shop=pandora` one card shows the broken-image icon on a blank white card.

I loaded all 3,189 unique image URLs from `public/products.json` with `new Image()` in Chrome. Exactly one fails:

- Product `PSG2629` "Disney Mulan Ring Set", category `rings`

- `primaryImage` = `.../default/dw83a369b2/productimages/main_rect_base/PSG2629_RGB.jpg` (error on load)

- `hoverImage` is empty, and `images` holds only that same broken URL.

`PSG` ids are bundle sets. Pandora probably has no single `main_rect_base` shot for them, or the `dw...` version hash has gone stale.

The Pandora CDN returns 403 to curl and node (bot protection). Check URLs only in a real browser.

Cards are rendered by `NuxtImg` in `app/components/ProductCard.vue` (around lines 140-158). Neither image has an error fallback. The modal is `app/components/ProductModal.vue`, which uses `image2` and `images`.

## Goal

No card ever shows the broken-image icon.

## Details

1. Data: use Claude in Chrome to open the PSG2629 product page on au.pandora.net. Find a working image URL, such as the set's own photo or a component ring's image. Update `primaryImage` and `images` for PSG2629 in `public/products.json` in every category it appears in. Edit it with a small script, not by hand. If no image exists, remove the product. Check whether `scripts/fix_products.js` or the scraper should treat `PSG*` sets differently, and note it. Do not rewrite the scraper.

2. Fallback in `ProductCard.vue`: add `@error` handlers.
   - A failed hover image falls back to the primary image.
   - A failed primary image shows the existing `bg-photo` placeholder with the `i-heroicons-photo` icon. It must not show the browser's broken icon.

3. Fallback in `ProductModal.vue`: hide or replace any failed image the same way.

4. If the dev server is not running, start the stack with the project script (`run_project_script`).

## Done when

- [ ] PSG2629 shows an image, or the product is removed.

- [ ] Forcing a bad `src` in the browser shows the placeholder, not the broken icon. Test this on a card and in the modal.

- [ ] The root cause and the fix are recorded with save_note.

- [ ] The change is committed on the branch.
