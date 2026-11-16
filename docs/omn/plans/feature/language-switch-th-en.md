# Thai / English language switch (default Thai)

- Branch: `feature/language-switch-th-en`
- Target: `main`
- Source: prompt

## Plan

# Language switch: Thai / English

## Problem

The Nuxt 3 storefront (`app/`, Nuxt UI, Tailwind) has all UI text hardcoded in Thai: about 280 strings across about 20 files. Examples: `app/composables/useCategoryLabels.js` (`CATEGORY_LABELS_TH`, `CATEGORY_PILLS`), `app/components/AppFooter.vue` (dark mode toggle aria labels), `AppHeader.vue`, `Cart.vue`, `Checkout.vue`, `ProductCard.vue`, `ProductModal.vue`, `EmptyCart.vue`, `PriceFilter.vue`, `ButtonSortBy.vue`, `useConfirm.js`, and the pages in `app/pages/`. There is no way to view the site in English.

## Goal

Add a button that switches the UI between Thai and English. Thai is the default.

## Details

- Do not add `@nuxtjs/i18n` or any other dependency. Build a small composable, e.g. `app/composables/useLocale.js`:
  - `locale` stored in `useCookie('lang', { default: () => 'th' })` so SSR renders the right language with no flash.
  - `t(key, params?)` reads from two message dictionaries (e.g. `app/locales/th.js`, `app/locales/en.js`) with the same keys. Missing EN key falls back to TH.
  - `toggleLocale()`.

- Move every hardcoded Thai UI string into the dictionaries and replace it with `t(...)`. Include aria-labels, titles, toasts, confirm dialog text, empty states, and category labels. Make `categoryLabelTh` / `productTypeLabelTh` locale-aware (rename if cleaner, update all callers).

- Write natural English translations suited to a jewellery store.

- Product data (names, descriptions from the API / `products.json`) stays as-is. Only UI strings are translated.

- Set `<html lang>` to `th` or `en` from the locale (`useHead` in `app/app.vue`).

- Add the switch button in `AppHeader.vue`, styled like the existing icon buttons. Show the target language as a short label ("EN" when Thai is active, "TH" when English is active), with an aria-label. Make it fit at phone width.

- Dates via `dayjs`: if any are shown, use the matching locale. Currency formatting stays the same.

- Find all Thai strings with `grep -rnE '[ก-๙]' app`. After the change, the only Thai left should be in `app/locales/th.js` (and comments, if any).

## Done when

- [ ] Site loads in Thai by default on first visit.

- [ ] Clicking the header button switches every UI string to English and back. Choice persists across reload (cookie) and SSR renders it with no flash.

- [ ] `grep -rnE '[ก-๙]' app` shows Thai only in the TH dictionary.

- [ ] `npm run build` passes.

- [ ] Checked in the browser with Claude in Chrome: home, products, product page, cart, checkout, favorites, in both languages, desktop and phone width. Dark mode still works.

- [ ] Changes committed on the branch.
