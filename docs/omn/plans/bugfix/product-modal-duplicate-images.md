# Dedupe product modal images by file name

- Branch: `bugfix/product-modal-duplicate-images`
- Target: `main`
- Source: prompt

## Plan

## Problem

The product modal carousel (`app/components/ProductModal.vue`, `images` computed around line 32) shows duplicate photos. It dedupes on the URL without the query string (`src.split("?")[0]`). Pandora serves the same photo under URLs that differ in extension or folder, so they slip through. Example from `public/products.json`, "Music Note Mini Charm":

- `hoverImage` `.../dw8aba1552/productimages/modeldetailshot_rect/2026Q1A_..._RGB_charm.jpg?q=70...` and `images[0]` the same path ending `.png`.

- `primaryImage` `.../main_rect_base/794513C00_RGB.jpg` and `images[1]` `.../main_rect_center/794513C00_RGB.png`, the same shot.

## Goal

Each distinct photo shows once in the slides and the thumbnails.

## Details

- Change the dedupe key to the last path segment without its extension and query, lowercased (for example `794513c00_rgb`, `2026q1a_..._rgb_charm`). Keep the first occurrence, so `primaryImage` stays first.

- Keep `normaliseImage` and the `failedImages` logic working. A failed image should still be dropped, and its duplicate (another URL with the same key) should be able to take its place. Store failures by full URL without query, not by the new key, so a broken `.jpg` does not hide a working `.png`.

- Check `app/components/ProductCard.vue` and `app/pages/product/[id].vue` / `ImageSliderWithModal.vue` for the same duplicate issue. Apply the same key there only if they build a multi-image list.

- Do not change `public/products.json`.

## Done when

- [x] The "Music Note Mini Charm" modal shows no repeated photos (6 distinct images, not 8).

- [x] `npm run build` passes.
