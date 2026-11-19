import { getProductById } from "./store.js";

export const useProductModal = () => {
  const product = useState("productModal", () => null);
  const route = useRoute();
  const router = useRouter();

  const setQuery = (id) => {
    const query = { ...route.query };
    if (id) query.product = id;
    else delete query.product;
    if (query.product === route.query.product) return;
    router.replace({ query });
  };

  const open = (p) => {
    product.value = p;
    setQuery(p?.id ?? null);
  };
  const close = () => {
    product.value = null;
    setQuery(null);
  };
  const isOpen = computed(() => product.value !== null);
  return { product, isOpen, open, close };
};

// Keep modal in sync with ?product=<id> (deep link, Back/Forward). Client-only.
export const useProductModalUrlSync = () => {
  const { product } = useProductModal();
  const route = useRoute();
  const router = useRouter();

  const sync = async () => {
    const raw = route.query.product;
    const id = Array.isArray(raw) ? raw[0] : raw;
    if (!id) {
      if (product.value) product.value = null;
      return;
    }
    if (product.value?.id === id) return;
    let found = null;
    try {
      found = await getProductById(id);
    } catch {
      /* treat as not found */
    }
    // route may have changed while loading
    const current = route.query.product;
    if ((Array.isArray(current) ? current[0] : current) !== id) return;
    if (found) {
      product.value = found;
    } else {
      const query = { ...route.query };
      delete query.product;
      router.replace({ query });
    }
  };

  onMounted(() => {
    sync();
    watch(() => route.query.product, sync);
  });
};
