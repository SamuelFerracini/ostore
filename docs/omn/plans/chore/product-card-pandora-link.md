# Add "View on Pandora" link to product card

- Branch: `chore/product-card-pandora-link`
- Target: `main`
- Source: prompt

## Plan

## Problem

Each product in `public/products.json` has a `link` field that points to the product's page on au.pandora.net. Only `app/components/ProductModal.vue` (around line 460) shows this link today, as "View on Pandora" (`t("modal.viewPandora")`). `app/components/ProductCard.vue` does not show it.

## Goal

Show a small "View on Pandora" text link on every product card that has a `link`.

## Details

- File: `app/components/ProductCard.vue`.

- Place the link directly under the meta line (`<p ...>{{ metaLine(product) }}</p>`) and above the CTA block (`mt-auto pt-3.5`).

- Render it only when `product.link` exists: `v-if="product.link"`.

- Use an `<a>` with `:href="product.link"`, `target="_blank"` and `rel="noopener noreferrer"`.

- Match the modal link style: `text-[13px]` (to match the card's other small text), `text-royal dark:text-[#D8B868] underline underline-offset-2`, plus a small top margin such as `mt-1`. Add a small external-link icon after the text, such as `<UIcon name="i-heroicons-arrow-top-right-on-square" size="14" aria-hidden="true" />`, in an `inline-flex items-center gap-1` wrapper.

- Reuse the existing `modal.viewPandora` locale key. Do not add a new key unless the text needs to differ. If you add one, add it to both `app/locales/en.js` and `app/locales/th.js`.

- The link must not open the modal and must not trigger any other card action. Add `@click.stop` if needed.

- Keep the card heights aligned in the grid. A card without a link must not shift the CTA button out of line with its neighbours. The CTA already uses `mt-auto`, so check that this still works.

- Do not change anything else.

## Done when

- [ ] Every card with a `link` shows "View on Pandora ↗" under the meta line, and the link opens au.pandora.net in a new tab.

- [ ] Cards without a `link` show no link and still look correct.

- [ ] The link looks correct in light and dark mode and in both Thai and English.

- [ ] Clicking the link does not open the product modal.

- [ ] `npm run build` (or the project's type check/lint) passes.
