// Order of the category pills in the header. "" means all products.
export const CATEGORY_PILL_IDS = [
  { id: "all-sale", sale: true },
  { id: "" },
  { id: "rings" },
  { id: "charms" },
  { id: "bracelets" },
  { id: "necklaces" },
  { id: "earrings" },
  { id: "gift-sets" },
  { id: "other" },
];

const SALE_CATEGORIES = ["all-sale", "clearance"];

// Locale-aware category labels. Call inside setup().
export const useCategoryLabels = () => {
  const { t } = useLocale();

  const categoryLabel = (id) => {
    const key = `cat.${id}`;
    const label = t(key);
    return label === key ? getCategoryName(id) : label;
  };

  // The product type (ring, charm…) of a product, ignoring sale buckets.
  const productTypeLabel = (product) => {
    const categories = product?.categories ?? [];
    const type = categories.find((c) => !SALE_CATEGORIES.includes(c));
    if (type) return categoryLabel(type);
    if (categories.length) return categoryLabel(categories[0]);
    return product?.category ? categoryLabel(product.category) : "";
  };

  const categoryPills = computed(() =>
    CATEGORY_PILL_IDS.map((pill) => ({
      ...pill,
      label: pill.id ? categoryLabel(pill.id) : t("cat.all"),
    })),
  );

  return { categoryLabel, productTypeLabel, categoryPills };
};
