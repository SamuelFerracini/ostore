# Match Cart empty state height to Favorites

- Branch: `chore/cart-empty-state-match-favorites`
- Target: `main`
- Source: prompt

## Plan

## Problem

Nuxt app. The empty Favorites page (`app/pages/favorites.vue`) and the empty Cart page (`app/pages/cart.vue`) put the footer (`app/components/AppFooter.vue`) at different heights. On Favorites the footer shows half on screen. On Cart it sits below the fold.

Cause: the empty states differ in size.

- `favorites.vue` (around line 26–28): empty state is `flex min-h-[50vh] flex-col items-center justify-center px-5 pb-16 text-center` with a 96px (`h-24 w-24`) round icon, a title, a line of text and a button.

- `cart.vue` renders `<EmptyCart v-if="!cartItems.length" />`. In `app/components/EmptyCart.vue` the non-compact path uses `px-4 py-12 md:py-20`, a 220px circle (`w-[220px] h-[220px]`) with a `w-40 h-40` SVG slipper illustration, plus category links. That makes the page much taller.

## Goal

The empty Cart page uses the same wrapper box and spacing as the empty Favorites page. The footer then sits at the same spot on both pages at the same viewport size. Cart keeps its slipper illustration, made smaller to fit.

## Details

- Change only the non-compact path of `EmptyCart.vue`. The `compact` prop is used elsewhere (for example a header dropdown). Leave it exactly as it is.

- Non-compact wrapper: use the same classes as Favorites' empty box (`flex min-h-[50vh] flex-col items-center justify-center px-5 pb-16 text-center`). Drop `py-12 md:py-20`.

- Shrink the illustration circle so the total content height is close to Favorites' (96px icon + title + text + button). Size it near Favorites' icon, e.g. `w-24 h-24` circle with a matching smaller SVG. Pick the value that best matches.

- Match the title, text and button styles and spacing to Favorites (`mt-6` title `font-display-th text-2xl font-semibold`, `mt-2 text-[15px] text-muted`, `mt-6` gold pill button). If the category links make the box taller than Favorites', keep them only if they fit inside the same height. Otherwise remove them and say so in your summary.

- Swap any hard-coded dark hex colors in the touched code (e.g. `dark:text-[#EEF2F8]`, `dark:stroke-[#D8B868]`) for the `night-*` tokens already used in `favorites.vue` (`dark:text-night-text`, `dark:stroke-night-gold` etc.), as the last cart commit did.

- Do not change `favorites.vue` unless needed for a pixel match.

## Tools

- Claude in Chrome: run the dev server, open `/favorites` and `/cart` with both empty, on desktop (1440 wide) and phone (390 wide), light and dark. Check the footer top sits at the same y-position on both pages. Also open the compact EmptyCart (header cart dropdown with empty cart) and check it is unchanged.

## Done when

- [ ] Empty Cart and empty Favorites show the footer at the same height on desktop and phone.

- [ ] Compact EmptyCart looks unchanged.

- [ ] Light and dark mode both look right.

- [ ] Changes committed on the branch.
