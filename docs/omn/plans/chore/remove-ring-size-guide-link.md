# Remove dead ring size guide link

- Branch: `chore/remove-ring-size-guide-link`
- Target: `main`
- Source: prompt

## Plan

## Problem

The product modal shows a "How to measure ring size" link next to the ring size picker. It points to `href="#"` and goes nowhere. No ring size guide exists.

## Goal

Remove the link and its unused translation keys.

## Details

- `app/components/ProductModal.vue` ~line 389: delete the `<a href="#">{{ t("modal.ringGuide") }}</a>` element.

- The wrapping `<div class="flex items-baseline justify-between gap-3 mb-3">` then holds only the `<legend>`. Keep the legend and its spacing (`mb-3`). Drop `justify-between gap-3` if it no longer does anything. Keep the `<legend>` valid inside the `<fieldset>`.

- Remove the `"modal.ringGuide"` key from `app/locales/en.js` and `app/locales/th.js` (line 101 in both).

- Run `git grep ringGuide` afterwards: it must return nothing.

- Do not change anything else.

## Done when

- [ ] The link is gone from the modal for ring products, in both Thai and English.

- [ ] No `ringGuide` references remain.

- [ ] The app builds and any existing tests and lint pass.
