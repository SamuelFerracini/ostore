# Fix product modal arch image letterboxing

- Branch: `bugfix/product-modal-arch-image-fit`
- Target: `main`
- Source: prompt

## Plan

## Problem

In `app/components/ProductModal.vue`, the main gallery photo sits inside an arch frame (`.pm-arch-inner`, rounded top corners, `overflow-hidden`, `bg-photo`). The slide `<img>` (around line 295) uses `object-contain`. When the photo's aspect ratio differs from the frame's, the photo is letterboxed: it shows flat top and bottom edges inside the arch, with empty `bg-photo` bands above and below. The arch curve does not shape the photo. It looks cropped wrong.

## Goal

Make the photo fill the arch frame so the arch clips it, the same way `app/components/ProductCard.vue` handles its arch photos.

## Details

- Change the slide image class from `w-full h-full object-contain` to `w-full h-full object-cover`.

- Check that each `SwiperSlide` fills the full Swiper height. If it does not, add `h-full` to the slide.

- Leave the thumbnail rail, nav buttons, counter, and arch CSS unchanged.

- Use Claude in Chrome to open a product modal on desktop (≥768px) and mobile widths. Check that the photo fills the arch and the curved top clips it. Check images with a portrait aspect ratio and with a landscape one.

## Done when

- [ ] No flat image edges or empty bands appear inside the arch at desktop or mobile widths.

- [ ] Nav arrows, counter, and pagination still work.

- [ ] The change is committed on this branch.
