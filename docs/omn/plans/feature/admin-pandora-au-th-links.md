# Admin mode: show Pandora AU and TH links

- Branch: `feature/admin-pandora-au-th-links`
- Target: `main`
- Source: prompt

## Plan

# Admin mode: show Pandora AU and TH links

## Problem

Nuxt 3 storefront in `app/`. Admin mode (`app/composables/useAdmin.js`, toggled by `?admin=1`, stored in the `ostore_admin` cookie) shows one link, "View on Pandora website" (`t("modal.viewPandora")`), pointing at `product.link`. Every `product.link` in `public/products.json` is an Australian URL (`https://au.pandora.net/en/...`). The admin also wants a link to the same product on the Thai Pandora site, `pandora.co.th`.

Link locations, both gated by `v-if="isAdmin && product.link"`:

- `app/components/ProductCard.vue` (~line 253)

- `app/components/ProductModal.vue` (~line 483)

## Goal

In admin mode, show two links on product cards and in the product modal: one to Pandora AU, one to Pandora TH.

## Details

- `products.json` has no TH URL. pandora.co.th is a Magento site with different URL slugs, so build the TH link from the product id (`product.id`, e.g. `368611C00`).

- First, use Claude in Chrome (load the `anthropic-skills:chrome-browser` skill first) to find a TH URL that lands on or finds the product by id. Try the Magento search `https://www.pandora.co.th/catalogsearch/result/?q=<id>` with 3–5 ids from `products.json`, including a ring and a charm. Use only read-only browsing: do not log in and do not add anything to a cart. If a better pattern exists (direct product page by SKU), use it. If neither works, stop and report with save_note; do not ship a broken link.

- Put the URL builder in one place, such as a `pandoraThLink(product)` helper next to `useAdmin` or in `app/composables/store.js`. Do not edit `products.json` or the scraper.

- Keep the AU link as `product.link`. Show TH only when `product.id` exists.

- Labels: replace the single `modal.viewPandora` text with two short labels in `app/locales/en.js` and `app/locales/th.js`, e.g. EN "Pandora AU" / "Pandora TH", TH "Pandora ออสเตรเลีย" / "Pandora ไทย". Both links open in a new tab with `rel="noopener noreferrer"`, like today's link.

- Keep the existing link style. On the card, fit both links in one row at 390px width without overlapping other buttons.

- Not in admin mode: no Pandora links, same as today.

## Testing

Start the app with the project script that brings the stack up (run_project_script), or `npm run dev` from this worktree. Do not wait for the user to switch here. With Claude in Chrome:

1. `/products`: no Pandora links.

2. `/products?admin=1`: card and modal both show AU and TH links. Open each for 2 products; AU opens the product, TH finds the same product.

3. Check 1440px and 390px, light and dark.

4. `?admin=0`: links hidden again. No hydration warnings in the console.

## Done when

- [ ] In admin mode, cards and modal show working AU and TH links. Outside admin mode, they show none.

- [ ] TH URL pattern checked on pandora.co.th; results saved with save_note (pattern used, ids tested).

- [ ] `npm run build` passes.

- [ ] Changes committed on the branch.
