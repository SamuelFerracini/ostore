# Show picked products from the poster bar

- Branch: `feature/poster-bar-picked-list`
- Target: `main`
- Source: prompt

## Plan

# Show picked products from the poster bar

## Problem

In admin mode, the admin picks products for a poster from the store pages. The floating bar `app/components/PosterBar.vue` shows "Poster (N)", "Clear" and "Build poster". The admin cannot see which products are picked without opening the builder page or scrolling the store for the highlighted cards.

## Goal

Add a button to the poster bar that opens a small panel (drawer/popover) listing the picked products. The admin stays on the current page.

## Details

- The selection lives in `app/composables/usePosterSelection.js`: `items` (in pick order, each `{ id, name, primaryImage, price_normalised, label }`), `count`, `remove(id)`, `clear()`. Reuse it. Do not change its storage format.

- Add a "Show" toggle button in `PosterBar.vue`. Making the "Poster (N)" count itself the toggle is fine if it reads well. Use `aria-expanded` and `aria-controls`.

- The panel opens above the bar. On mobile the bar sits above the bottom nav (`bottom: calc(76px + env(safe-area-inset-bottom))`, `left: 1rem`). On desktop it is centred at `bottom: 1.5rem`. Keep the panel inside the screen at 375px width, with a 16px side gutter. Give it a max height and scroll the list inside it.

- Each row: the pick number (same as the badge on `ProductCard`), a small square thumbnail (`primaryImage`, use the image URL directly, not the `/api/img` proxy), the name (truncate to 1–2 lines), the price label (`posterLabel` from the composable), and a remove (×) button with an aria-label. Add a "Build poster" link at the bottom or keep the one in the bar.

- Close the panel on Escape, on an outside click, and when you navigate. Close it when the count reaches 0 (the bar hides then anyway).

- Match the bar's look: navy / midnight surface, gold accents, dark mode classes as in the bar. Use the frontend-design plugin for the panel's look.

- Add the new strings (button label, panel aria label, remove aria label if a new one is needed) to `app/locales/en.js` and `app/locales/th.js` beside the other `poster.*` keys. Reuse `poster.remove` if it fits.

- Customers (no admin cookie) see no change. Admin mode is on with `?admin=1`.

## Testing

Start the app with `npm run dev` in this worktree. Use Claude in Chrome to turn on admin mode (`?admin=1`), pick 3 or more products, open the panel, remove one, and check the store card badge numbers update. Check at 375px and desktop width, in light and dark mode.

## Done when

- [ ] The poster bar has a button that opens and closes a list of the picked products, in pick order, with thumbnails, names and prices.

- [ ] Removing an item in the panel removes it from the selection, and the card badges update.

- [ ] The panel fits at 375px wide and closes on Escape, an outside click and navigation.

- [ ] Non-admin users see no change.

- [ ] `npm run build` passes.
