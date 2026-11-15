# Fix product card photo rendering in bottom half

- Branch: `bugfix/product-card-image-offset`
- Target: `main`
- Source: prompt

## Plan

## Problem

On product cards (`app/components/ProductCard.vue`), the product photo shows only in the bottom half of the arch frame. The top half is empty `bg-photo` (light grey).

Cause: both `<NuxtImg>` elements inside the full-cover `<button>` use `absolute h-full w-full` but set no `top`/`left`. An absolutely positioned element with no offsets sits at its static position. A `<button>` centers its content vertically, so the image's top edge lands at 50% and the rest is clipped by `overflow-hidden` on `.arch-photo`. The loading placeholder `<span>` already has `inset-0` and renders correctly.

## Goal

The photo fills the whole arch frame, top to bottom.

## Details

- In `app/components/ProductCard.vue`, add `inset-0` to the class of both `<NuxtImg>` elements (the hover image and the primary image).

- Do not change anything else.

- Check that other components do not have the same pattern (absolute img inside a button with no inset), for example `app/pages/product/[id].vue` and the product modal. Fix them the same way only if they show the bug.

## Done when

- [x] Both images have `inset-0`.

- [ ] Use Claude in Chrome to open the products page in the running dev app. Confirm the photo fills the full arch, and that the hover swap still works.

- [ ] Commit on this branch.
