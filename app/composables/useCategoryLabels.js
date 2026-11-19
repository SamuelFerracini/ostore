// Sentinel id of the "All" pill. A missing category means all-sale instead.
export const ALL_CATEGORY = "all";

// Category the page shows for a URL query: the explicit one, else all-sale
// (when the shop has it and no search is running), else "all".
export const resolveCategory = (query, shop) => {
  if (query.category) return query.category;
  const hasSale = (shop?.categories || []).some((c) => c.id === "all-sale");
  return hasSale && !query.q ? "all-sale" : ALL_CATEGORY;
};

// Order of the category pills in the header.
export const CATEGORY_PILL_IDS = [
  { id: "all-sale", sale: true },
  { id: ALL_CATEGORY },
  { id: "rings" },
  { id: "charms" },
  { id: "bracelets" },
  { id: "necklaces" },
  { id: "earrings" },
  { id: "gift-sets" },
  { id: "other" },
];

// Locale-aware category labels. Call inside setup().
export const useCategoryLabels = () => {
  const { t } = useLocale();

  const categoryLabel = (id) => {
    const key = `cat.${id}`;
    const label = t(key);
    return label === key ? getCategoryName(id) : label;
  };

  const categoryPills = computed(() =>
    CATEGORY_PILL_IDS.map((pill) => ({
      ...pill,
      label: pill.id === ALL_CATEGORY ? t("cat.all") : categoryLabel(pill.id),
    })),
  );

  return { categoryLabel, categoryPills };
};
