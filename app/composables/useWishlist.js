const STORAGE_KEY = 'wishlist';

const keyOf = product => product?.id ?? product?.databaseId ?? null;

// Keep only the fields the favorites page and ProductCard need.
const toRecord = product => ({
  id: keyOf(product),
  name: product.name,
  primaryImage: product.primaryImage,
  hoverImage: product.hoverImage,
  price_normalised: product.price_normalised,
  market_thb: product.market_thb,
  originalPrice_normalised: product.originalPrice_normalised,
  categories: product.categories,
  category: product.category,
  sizes: product.sizes,
  link: product.link,
  shop: product.shop,
});

const persist = list => {
  if (!import.meta.client) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    // storage blocked or full: keep in-memory state only
  }
};

export const useWishlist = () => {
  const wishlist = useState('wishlist', () => []);
  const loaded = useState('wishlist-loaded', () => false);

  const load = () => {
    if (loaded.value) return;
    loaded.value = true;
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      if (!Array.isArray(parsed)) return;
      const seen = new Set();
      // Drop legacy entries (no `id`) and duplicates.
      wishlist.value = parsed
        .filter(item => item && item.id != null && !seen.has(item.id) && seen.add(item.id))
        .map(item => ({ ...item }));
      persist(wishlist.value);
    } catch (e) {
      wishlist.value = [];
    }
  };

  // Client only, after hydration, so SSR markup matches.
  if (getCurrentInstance()) onMounted(load);

  const isWishlisted = id => {
    const key = id !== null && typeof id === 'object' ? keyOf(id) : id;
    return key != null && wishlist.value.some(item => item.id === key);
  };

  const removeFromList = id => {
    wishlist.value = wishlist.value.filter(item => item.id !== id);
    persist(wishlist.value);
  };

  const toggleWishlist = product => {
    const key = keyOf(product);
    if (key == null) return;
    if (isWishlisted(key)) removeFromList(key);
    else {
      wishlist.value = [...wishlist.value, toRecord(product)];
      persist(wishlist.value);
    }
  };

  return { wishlist, isWishlisted, toggleWishlist, removeFromList };
};
