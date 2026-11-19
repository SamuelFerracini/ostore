# Default products page to the All Sales tab

- Branch: `feature/default-sale-tab`
- Target: `main`
- Source: prompt

## Plan

## Problem

On `/products`, the category pills (`app/components/CarouselCategories.vue`) select "All" when the URL has no `category` query. Pill order lives in `CATEGORY_PILL_IDS` in the `useCategoryLabels` composable. `{ id: "all-sale", sale: true }` is already first, and `{ id: "" }` means all products. Users land on "All" instead of the sale tab.

## Goal

Opening `/products` with no `category` query selects and loads the **All Sales** (`all-sale`) pill. Users can still pick "All" to see every product.

## Details

- Treat a missing `route.query.category` as `all-sale`. Do this in the pill active state (`isActive` in `CarouselCategories.vue`) and in the product fetch `variables` and `heading` in `app/pages/products.vue`.

- The "All" pill can no longer use the empty id, because empty now means sale. Give it an explicit sentinel id such as `all`. Map that sentinel to `category: undefined` in the search variables, and to `t("products.all")` in the heading. Update `setCategory`, the pill `:key`, and the label logic in `categoryPills` (currently `pill.id ? categoryLabel(...) : t("cat.all")`).

- Search (`route.query.q`) has its own behaviour today. A search with no category must still search all products, not only sale items. Check how `q` and `category` combine in `products.vue` and keep search unfiltered.

- Keep existing links working: `EmptyCart.vue` (`/products?category=all-sale`, `/products?q=...`, `/products`), `AppHeader.vue` (`/products`), and `app/pages/index.vue` (`/products?shop=...`).

- Only the Pandora shop has `all-sale` (`stores/website.ts`). If the selected shop lacks `all-sale`, fall back to all products.

- Use the `run` skill, or start the dev server, to check the page in a browser.

## Done when

- [ ] `/products` opens with All Sales active and only sale products listed.

- [ ] Clicking "All" lists all products, and its URL is shareable.

- [ ] `/products?q=ring` searches all products.

- [ ] A shop without `all-sale` still opens on all products.

- [x] `npm run build` (or the project's lint or typecheck) passes.
