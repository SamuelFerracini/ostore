import { readFileSync } from "fs";

const oldData = JSON.parse(readFileSync("public/products copy.json", "utf-8"));
const newData = JSON.parse(readFileSync("public/products.json", "utf-8"));

function flattenProducts(data) {
  const map = new Map();
  for (const [shop, categories] of Object.entries(data)) {
    for (const [category, products] of Object.entries(categories)) {
      for (const product of products) {
        const key = `${shop}::${product.id}`;
        map.set(key, { ...product, category });
      }
    }
  }
  return map;
}

const oldProducts = flattenProducts(oldData);
const newProducts = flattenProducts(newData);

const added = [];
const removed = [];
const priceChanged = [];

for (const [key, product] of newProducts) {
  if (!oldProducts.has(key)) {
    added.push(product);
  } else {
    const old = oldProducts.get(key);
    if (old.price !== product.price || old.salePrice !== product.salePrice) {
      priceChanged.push({
        shop: product.shop,
        id: product.id,
        name: product.name,
        category: product.category,
        oldPrice: old.price,
        newPrice: product.price,
        oldSalePrice: old.salePrice,
        newSalePrice: product.salePrice,
      });
    }
  }
}

for (const [key, product] of oldProducts) {
  if (!newProducts.has(key)) {
    removed.push(product);
  }
}

console.log("=".repeat(60));
console.log(`PRODUCT COMPARISON REPORT`);
console.log(`Old file: products copy.json | New file: products.json`);
console.log("=".repeat(60));

console.log(`\n--- ADDED (${added.length}) ---`);
for (const p of added) {
  console.log(`  [${p.shop}] ${p.name} (${p.id}) - $${p.price} [${p.category}]`);
}

console.log(`\n--- REMOVED (${removed.length}) ---`);
for (const p of removed) {
  console.log(`  [${p.shop}] ${p.name} (${p.id}) - $${p.price} [${p.category}]`);
}

console.log(`\n--- PRICE CHANGED (${priceChanged.length}) ---`);
for (const p of priceChanged) {
  const parts = [`price: $${p.oldPrice} → $${p.newPrice}`];
  if (p.oldSalePrice !== p.newSalePrice) {
    parts.push(`sale: $${p.oldSalePrice ?? "none"} → $${p.newSalePrice ?? "none"}`);
  }
  console.log(`  [${p.shop}] ${p.name} (${p.id}) [${p.category}] | ${parts.join(" | ")}`);
}

console.log("\n" + "=".repeat(60));
console.log(
  `TOTALS: ${added.length} added, ${removed.length} removed, ${priceChanged.length} price changes`
);
console.log(
  `Old product count: ${oldProducts.size} | New product count: ${newProducts.size}`
);
console.log("=".repeat(60));
