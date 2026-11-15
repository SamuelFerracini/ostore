# Align cart page layout with favorites

- Branch: `chore/cart-page-layout-match-favorites`
- Target: `main`
- Source: prompt

## Plan

## Problem

`app/pages/cart.vue` uses a different page shell from every other page (`app/pages/favorites.vue`, `app/pages/products.vue`). As a result it looks off:

- It has a "← เลือกซื้อต่อ" back link next to the title. Favorites has no back link.

- Its container is `max-w-[1200px] px-4 py-5 lg:px-6 lg:py-8`. Header, footer, products and favorites use `mx-auto max-w-[1440px] px-4 lg:px-8`, so the cart content is inset more than the logo.

- Its outer wrapper paints its own background (`bg-ivory dark:bg-midnight min-h-[calc(100vh-64px)]`). Other pages sit on the app background.

- Its title is a fixed `text-[32px]` and shares a row with the back link and item count.

- Its dark mode uses hardcoded colors `#EEF2F8`, `#B7C3D9` and `#D8B868`. The rest of the site uses the `night-text`, `night-muted` and `night-gold` tokens.

## Goal

Make the cart page shell and title block match `app/pages/favorites.vue` exactly. Keep the cart's item list, summary card and behavior unchanged.

## Details

- Remove the back link "← เลือกซื้อต่อ" entirely.

- Outer wrapper: `mx-auto max-w-[1440px] px-4 lg:px-8`. Drop the page-level background, the min-height wrapper and the `py-*` padding.

- Title block: copy favorites, i.e. `<div class="pt-6 pb-5 lg:pt-9 lg:pb-7">` with `h1` `font-display-th text-[26px] lg:text-[34px] font-semibold leading-tight text-navy dark:text-night-text`. Put the item count below it as `<p class="mt-1 text-[15px] text-muted dark:text-night-muted">{{ fmt(cartCount) }} ชิ้น</p>`, shown only when the cart has items.

- Add `pb-10` after the content, as favorites does.

- Replace the hardcoded dark colors in `cart.vue` with tokens: `#EEF2F8` becomes `night-text`, `#B7C3D9` becomes `night-muted` and `#D8B868` becomes `night-gold`. Check `tailwind.config.ts` that these tokens exist and that the values are equal or close. If a token is missing, leave that color as it is and mention it in your summary.

- Do not change `EmptyCart`, the item cards, the summary aside or any script logic.

## Tools

Use Claude in Chrome to open `/cart` and `/favorites` side by side in both light and dark mode. Test with an empty cart and with items. Confirm that the title position, container edges and background match.

## Done when

- [ ] No back link on `/cart`.

- [ ] The cart title, container width, padding and background match `/favorites` visually.

- [ ] Existing tests pass. The change is committed on the branch.
