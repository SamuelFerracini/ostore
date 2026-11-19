import website from "../stores/website.ts";

let data = {};
let productsById = new Map();
let loading = null;
const details = new Map();

// Fetch public/products-index.json once (built by
// scripts/build-product-index.mjs) and expand it to the old
// { [shop]: { [category]: Product[] } } shape. Categories hold references to
// one shared object per product, so all-sale costs no extra copies.
// Concurrent callers share the same request.
export function loadProducts() {
  if (Object.keys(data).length > 0) return Promise.resolve(data);
  if (loading) return loading;

  loading = (async () => {
    const response = await fetch("/products-index.json");

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const index = await response.json();
    const byId = new Map(Object.entries(index.products ?? {}));
    const expanded = {};
    for (const [shop, categories] of Object.entries(index.shops ?? {})) {
      expanded[shop] = {};
      for (const [category, ids] of Object.entries(categories ?? {})) {
        expanded[shop][category] = ids.map((id) => byId.get(id)).filter(Boolean);
      }
    }
    productsById = byId;
    data = expanded;
    return data;
  })().finally(() => {
    loading = null;
  });

  return loading;
}

// Product from the index by id, or null. Loads the index if needed.
export async function getProductById(id) {
  if (id == null) return null;
  await loadProducts();
  return productsById.get(String(id)) ?? null;
}

// Detail data for one product (gallery images), fetched on demand from
// public/products-detail/<id>.json and cached. Resolves to {} when missing.
export function loadProductDetail(id) {
  if (id == null || id === "") return Promise.resolve({});
  const key = String(id);
  if (!details.has(key)) {
    const request = fetch(`/products-detail/${encodeURIComponent(key)}.json`)
      .then((res) => (res.ok ? res.json() : {}))
      .catch(() => ({}));
    details.set(key, request);
    // Do not cache failures: a later open can retry.
    request.then((detail) => {
      if (!detail || Object.keys(detail).length === 0) details.delete(key);
    });
  }
  return details.get(key);
}

function orderObjectKeys(obj, order) {
  const orderedObject = {};

  // Add keys in the specified order
  for (const key of order) {
    if (key in obj) {
      orderedObject[key] = obj[key];
    }
  }

  // Add remaining keys that are not in the order list
  for (const key in obj) {
    if (!order.includes(key)) {
      orderedObject[key] = obj[key];
    }
  }

  return orderedObject;
}

export async function searchProducts({
  category,
  search,
  page = 1,
  perPage = 25,
  shop,
  minPrice,
  maxPrice,
  orderby,
  fieldby,
} = {}) {
  if (!data[shop]) {
    return { items: [], total: 0 };
  }

  let ordered = orderObjectKeys(
    data[shop],
    website.getters.selectedShop.categories.map((e) => e.id)
  );

  let filteredProducts = Object.values(ordered).flat();

  if (category) {
    filteredProducts = data[shop][category];
  }

  if (!filteredProducts) {
    return { items: [], total: 0 };
  }

  const uniqueProducts = new Map();
  filteredProducts.forEach((product) => {
    if (!uniqueProducts.has(product.id)) {
      uniqueProducts.set(product.id, product);
    }
  });
  filteredProducts = Array.from(uniqueProducts.values());

  if (search) {
    filteredProducts = filteredProducts.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    filteredProducts = filteredProducts.filter((item) => {
      const price = parseFloat(item.price_normalised);
      if (isNaN(price)) return true;

      const meetsMin = minPrice === undefined || price >= minPrice;
      const meetsMax = maxPrice === undefined || price <= maxPrice;

      return meetsMin && meetsMax;
    });
  }

  if (fieldby === "PRICE" && orderby) {
    filteredProducts.sort((a, b) => {
      const priceA = parseFloat(a.price_normalised);
      const priceB = parseFloat(b.price_normalised);

      if (orderby === "ASC") {
        return priceA - priceB;
      } else if (orderby === "DESC") {
        return priceB - priceA;
      }
      return 0;
    });
  }

  const start = (page - 1) * perPage;
  const end = start + perPage;

  // total counts every match, so callers need no second search to count.
  return {
    items: filteredProducts.slice(start, end),
    total: filteredProducts.length,
  };
}

export function listCategories() {
  return [
    {
      id: "charms",
      name: "Charms",
    },
    {
      id: "charm",
      name: "Charms",
    },
    {
      id: "rings",
      name: "Rings",
    },
    {
      id: "charms-and-bracelets",
      name: "Charms and Bracelets",
    },
  ];
}

export function getCategory(id) {
  return listCategories().find((e) => e.id === id);
}

export function getCategoryName(id) {
  return getCategory(id)?.name ?? id;
}
