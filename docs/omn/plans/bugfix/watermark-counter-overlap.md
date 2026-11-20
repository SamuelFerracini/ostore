# Fix watermark badge overlapped by image counter

- Branch: `bugfix/watermark-counter-overlap`
- Target: `main`
- Source: prompt

## Plan

## Problem

In the product modal image gallery, the watermark badge ("crown + fb.com/nonlapan.ssw", bottom-left) is overlapped by the "1 / 5" image counter pill. The counter covers the end of the handle text, so it reads "fb.com/nonlapan.ssw" cut off under the counter.

Cause:

- The badge is `app/components/ImageWatermark.vue`, used as `<ImageWatermark size="lg" />` at `app/components/ProductModal.vue:357`. The `lg` size uses a 16px font, so the badge reaches the middle of the image. It sits at `z-index: 5`.

- The counter is at `app/components/ProductModal.vue:377` with `hidden md:block absolute bottom-4 left-1/2 -translate-x-1/2 z-10 ...`, so it is centred at the bottom and drawn on top of the badge.

## Goal

The badge and the counter never overlap, and the full handle is always readable.

## Details

1. Move the counter to the bottom-right: replace `left-1/2 -translate-x-1/2` with `right-4` on the counter at `ProductModal.vue:377`. Keep its other classes. Check that it does not collide with the right nav arrow (`top-1/2`, vertically centred, so it should be fine).

2. Shrink the `lg` watermark size in `ImageWatermark.vue`: change `--wm-font` from 16px to 13px, `--wm-logo` from 20px to 16px, and `--wm-pad` from 12px to 10px or 12px, whichever looks balanced next to the counter's `bottom-4` (16px). Ideally the badge and the counter share the same bottom baseline.

3. Do not change the `sm` or `md` sizes, or the other usages (`ProductCard.vue`, `Cart.vue`, `pages/cart.vue`).

Use Claude in Chrome to open a product with several images in the modal. Check it at desktop widths around 768px, 1024px and 1440px, in both light and dark mode. Start the app with the project's dev/test stack script via run_project_script if one exists, otherwise with the dev command from `package.json`.

## Done when

- [ ] The counter sits at the bottom-right of the modal image and the badge at the bottom-left, with no overlap at md+ widths.

- [ ] The full "fb.com/nonlapan.ssw" text is visible on the large modal image.

- [ ] Other watermark sizes and usages are unchanged.

- [ ] Build/lint passes.
