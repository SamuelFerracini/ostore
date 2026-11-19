// Keep only cart items whose id exists in the expanded product index
// ({ [shop]: { [category]: Product[] } }). Ids compare as strings, so a
// number id in localStorage matches a string id in the index.
export function pruneMissingProducts(items, productsData) {
  const validIds = new Set();
  for (const categories of Object.values(productsData ?? {})) {
    for (const products of Object.values(categories ?? {})) {
      for (const product of products) validIds.add(String(product.id));
    }
  }
  return items.filter((item) => validIds.has(String(item.id)));
}
