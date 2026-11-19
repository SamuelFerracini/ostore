// Admin poster builder: the products picked for the poster, in pick order.
// Kept in localStorage so the pick survives navigation between categories,
// with enough data to render the poster without loading products.json.
const STORAGE_KEY = "ostore_poster_selection";

const toRecord = (product) => ({
  id: product.id,
  name: product.name,
  primaryImage: product.primaryImage,
  price_normalised: product.price_normalised,
  // Optional price-label override set in the builder. Empty = default label.
  label: "",
});

// Same rounding and grouping as formatPrice in ProductCard.
const priceFormat = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
export const posterDefaultLabel = (item) =>
  `\u{1F1E6}\u{1F1FA} ${priceFormat.format(Math.round(Number(item.price_normalised) || 0))} บาท`;

export const posterLabel = (item) => item.label?.trim() || posterDefaultLabel(item);

// Product images come from other hosts; the same-origin proxy keeps the
// export canvas untainted.
export const posterImageSrc = (url) =>
  url ? `/api/img?url=${encodeURIComponent(url)}` : "";

const persist = (list) => {
  if (!import.meta.client) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    // storage blocked or full: keep in-memory state only
  }
};

export const usePosterSelection = () => {
  const items = useState("poster-selection", () => []);
  const loaded = useState("poster-selection-loaded", () => false);

  // Read storage on the client only, after mount, so SSR markup matches.
  const load = () => {
    if (!import.meta.client || loaded.value) return;
    loaded.value = true;
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      if (!Array.isArray(parsed)) return;
      const seen = new Set();
      items.value = parsed
        .filter((p) => p && p.id != null && !seen.has(p.id) && seen.add(p.id))
        .map((p) => ({ ...toRecord(p), label: p.label || "" }));
    } catch (e) {
      items.value = [];
    }
  };

  onMounted(load);

  const save = () => persist(items.value);

  const isSelected = (id) => items.value.some((p) => p.id === id);

  const toggle = (product) => {
    if (!product || product.id == null) return;
    items.value = isSelected(product.id)
      ? items.value.filter((p) => p.id !== product.id)
      : [...items.value, toRecord(product)];
    save();
  };

  const remove = (id) => {
    items.value = items.value.filter((p) => p.id !== id);
    save();
  };

  // Move the item at `from` by `delta` places (-1 up, +1 down).
  const move = (from, delta) => {
    const to = from + delta;
    if (to < 0 || to >= items.value.length) return;
    const next = [...items.value];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    items.value = next;
    save();
  };

  const setLabel = (id, label) => {
    items.value = items.value.map((p) => (p.id === id ? { ...p, label } : p));
    save();
  };

  const clear = () => {
    items.value = [];
    save();
  };

  const count = computed(() => items.value.length);

  return { items, count, loaded, isSelected, toggle, remove, move, setLabel, clear };
};
