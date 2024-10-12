const products = [];

export async function loadProducts() {
  if (products.length > 0) {
    return products;
  }

  const categories = listCategories();

  for (const category of categories) {
    try {
      const url = `products/${category.id}.json`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      products.push(...data);
    } catch (err) {
      console.error(err);
    }
  }

  return products;
}

export async function searchProducts({
  category,
  search,
  page = 1,
  perPage = 25,
} = {}) {
  let filteredProducts = [...products];

  if (category) {
    filteredProducts = filteredProducts.filter((p) => p.category === category);
  }

  if (search) {
    filteredProducts = filteredProducts.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
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
