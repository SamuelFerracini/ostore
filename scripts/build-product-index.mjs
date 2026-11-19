// Split the scraped public/products.json into what the browser actually loads:
//
//   public/products-index.json        every product once, with only the fields
//                                     the grid, card, filters, sort, cart and
//                                     wishlist read, plus each category as an
//                                     ordered list of ids.
//   public/products-detail/<id>.json  per-product detail (the gallery images),
//                                     fetched when the modal or product page
//                                     opens.
//
// public/products.json stays the scraper output and this script's input; the
// app never fetches it. Run with `npm run build:products` (also runs before
// dev, build and generate).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = path.join(root, "public/products.json");
const INDEX = path.join(root, "public/products-index.json");
const DETAIL_DIR = path.join(root, "public/products-detail");

// Fields read by ProductCard, ProductModal, useWishlist, stores/cart.ts,
// pages/cart.vue, usePosterSelection and the search/filter/sort in store.js.
const INDEX_FIELDS = [
  "id",
  "shop",
  "name",
  "price_normalised",
  "originalPrice_normalised",
  "market_thb",
  "primaryImage",
  "hoverImage",
  "image2",
  "link",
  "categories",
  "category",
  "sizes",
];

// Only the modal and product page need these.
const DETAIL_FIELDS = ["images"];

// Ids become file names: keep them to a safe character set.
const SAFE_ID = /^[A-Za-z0-9._-]+$/;

const isEmpty = (v) =>
  v === null || v === undefined || v === "" || (Array.isArray(v) && v.length === 0);

const pick = (product, fields) => {
  const out = {};
  for (const key of fields) {
    if (!isEmpty(product[key])) out[key] = product[key];
  }
  return out;
};

const raw = JSON.parse(fs.readFileSync(SOURCE, "utf8"));

const products = {};
const details = new Map();
const shops = {};
let entries = 0;

for (const [shop, categories] of Object.entries(raw)) {
  shops[shop] = {};
  for (const [category, list] of Object.entries(categories ?? {})) {
    if (!Array.isArray(list)) continue;
    const ids = [];
    const seen = new Set();
    for (const product of list) {
      entries++;
      const id = product?.id;
      if (id == null || id === "") continue;
      if (!SAFE_ID.test(String(id))) {
        throw new Error(`Unsafe product id for a file name: ${JSON.stringify(id)}`);
      }
      // Same product id is the same product across categories (all-sale
      // repeats the others): store it once, first copy wins, matching the
      // first-match dedupe in searchProducts.
      if (!products[id]) {
        products[id] = pick(product, INDEX_FIELDS);
        details.set(id, pick(product, DETAIL_FIELDS));
      }
      if (!seen.has(id)) {
        seen.add(id);
        ids.push(id);
      }
    }
    shops[shop][category] = ids;
  }
}

fs.writeFileSync(INDEX, JSON.stringify({ products, shops }));

fs.rmSync(DETAIL_DIR, { recursive: true, force: true });
fs.mkdirSync(DETAIL_DIR, { recursive: true });
for (const [id, detail] of details) {
  fs.writeFileSync(path.join(DETAIL_DIR, `${id}.json`), JSON.stringify(detail));
}

const kb = (file) => `${(fs.statSync(file).size / 1024).toFixed(0)} KB`;
console.log(
  `products index: ${entries} entries -> ${Object.keys(products).length} products, ` +
    `${kb(SOURCE)} -> ${kb(INDEX)}; ${details.size} detail files`,
);
