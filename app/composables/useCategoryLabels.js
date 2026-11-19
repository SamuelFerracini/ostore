// Order of the category pills in the header. "" means all products.
export const CATEGORY_PILL_IDS = [
  { id: "all-sale", sale: true },
  { id: "" },
  { id: "rings" },
  { id: "charms" },
  { id: "bracelets" },
  { id: "necklaces" },
  { id: "earrings" },
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
      label: pill.id ? categoryLabel(pill.id) : t("cat.all"),
    })),
  );

  return { categoryLabel, categoryPills };
};
