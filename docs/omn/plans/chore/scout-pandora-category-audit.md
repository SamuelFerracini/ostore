# Scout: audit categories and missing products vs Pandora AU

- Branch: `chore/scout-pandora-category-audit`
- Target: `main`
- Source: prompt

## Plan

# Scout: audit ostore categories and product coverage vs Pandora

Read-only investigation. Do not change code in either repo.

## Problem

ostore (this repo, Nuxt storefront) shows Pandora products from `public/products.json`. The user wants:

1. Products shown under the **same categories as Pandora**, so shoppers are not confused.

2. **Every** Pandora product present. None missing.

Current state seen on `main`:

- `public/products.json` shape: `{ pandora: { <categoryKey>: [product, ...] } }`. Each product has `id`, `categories[]`, prices, images.

- Keys and counts: `all-sale` 12, `bracelets-debug` 201, `bracelets` 200, `charms` 890, `clearance` 12, `earrings` 170, `necklaces` 220, `rings` 299. 1705 unique ids.

- `bracelets-debug` looks like a leftover debug key. `bracelets` = exactly 200 and `rings` = 299 look like a cap or a scroll that stopped early.

- Header pills: `app/composables/useCategoryLabels.js` (`CATEGORY_PILL_IDS`: Sale, All, Rings, Charms, Bracelets, Necklaces, Earrings). Labels in `app/locales/en.js` and `th.js`. Category UI also in `app/pages/categories.vue`, `app/components/CarouselCategories.vue`, `ButtonSelectCategory.vue`.

- The data comes from a separate scraper repo: `/Users/samuelferracini/Workspace/pandora-scraper-2` (read only). Category URLs live in `scrape-jobs.js` (`CATEGORIES`) and `pandora.sh`; scraping logic in `scrape.js`, `scraper-service.js`, `shops/pandora.js`; output assembled by `normalize.js` / `deploy.js`. Check for `--max-products` caps or scroll limits.

- Image URLs point at `au.pandora.net`, so AU is the source catalogue. Products are sold in THB; `pandora.co.th` also exists.

## Goal

Find out exactly what Pandora's category structure is and how many products are missing, and why.

## Details

Use Claude in Chrome (load the `anthropic-skills:chrome-browser` skill first) to read au.pandora.net. Do not log in or add anything to a cart.

1. **Pandora category tree.** Record the top-level nav categories on au.pandora.net and their main sub-categories (e.g. Charms > Clip, Dangle, Spacer…; Necklaces & Pendants; Bracelets incl. bangles/chains; Sale). Note the exact Pandora names and URLs. Also glance at pandora.co.th nav and note if it differs.

2. **Total counts.** For each top-level category page Pandora shows a result count ("X products"). Record it. Compare with unique ids per category in `public/products.json`.

3. **Missing products.** Estimate missing per category. If practical, sample 10–20 product ids from Pandora pages not present in products.json.

4. **Root cause.** Find why products are missing: product caps, infinite scroll stopping, a category not scraped at all (e.g. sub-categories only reachable elsewhere, "Necklaces & Pendants" vs "necklaces", sets, gift cards, men's), dedupe issues, or the `bracelets-debug` key. Cite file:line in the scraper repo.

5. **Category mapping.** Propose how ostore should map to Pandora's categories: pill list, labels (EN + TH), and whether sub-category filters are worth adding. Note how a product in several Pandora categories should show.

## Done when

Results saved with save_note, containing:

- [ ] Pandora category tree with names + URLs + product counts.

- [ ] Table: category | Pandora count | ostore count | missing.

- [ ] Root causes with file:line refs.

- [ ] Recommended fix plan, split into: (a) scraper changes in pandora-scraper-2, (b) ostore UI/data changes in this repo.
