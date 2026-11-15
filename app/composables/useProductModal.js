export const useProductModal = () => {
  const product = useState("productModal", () => null);
  const open = (p) => {
    product.value = p;
  };
  const close = () => {
    product.value = null;
  };
  const isOpen = computed(() => product.value !== null);
  return { product, isOpen, open, close };
};
