import website from "../stores/website.ts";

let data = {};

export async function loadProducts() {
  console.log("Loading products...");

  if (Object.keys(data).length > 0) {
    return data;
  }

  const url = `/products.json`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  data = await response.json();

  return data;
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
} = {}) {
  if (!data[shop]) {
    return [];
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
    return [];
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

  const start = (page - 1) * perPage;
  const end = start + perPage;

  return filteredProducts.slice(start, end);
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

export function getProduct(slug, sku) {
  return {};
}

export function addToCart(input) {
  return {};
}

export function updateItemQuantities(input) {
  return {};
}

export function checkout(input) {
  return {};
}

export async function productExists(productId, shop = null) {
  try {
    const products = await loadProducts();

    // If shop is specified, only check that shop
    if (shop && products[shop]) {
      return Object.values(products[shop])
        .flat()
        .some((product) => product.id === productId);
    }

    // Otherwise check all shops
    for (const shopKey in products) {
      const shopProducts = Object.values(products[shopKey]).flat();
      if (shopProducts.some((product) => product.id === productId)) {
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error("Error checking if product exists:", error);
    return false;
  }
}

export async function getProductById(productId, shop = null) {
  try {
    const products = await loadProducts();

    // If shop is specified, only check that shop
    if (shop && products[shop]) {
      const shopProducts = Object.values(products[shop]).flat();
      return shopProducts.find((product) => product.id === productId) || null;
    }

    // Otherwise check all shops
    for (const shopKey in products) {
      const shopProducts = Object.values(products[shopKey]).flat();
      const product = shopProducts.find((product) => product.id === productId);
      if (product) {
        return product;
      }
    }

    return null;
  } catch (error) {
    console.error("Error getting product by ID:", error);
    return null;
  }
}
