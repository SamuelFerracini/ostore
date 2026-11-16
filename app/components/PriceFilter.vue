<script setup>
const route = useRoute();
const router = useRouter();
const { t } = useLocale();

const minPrice = ref(route.query.minPrice ? Number(route.query.minPrice) : 0);
const maxPrice = ref(
  route.query.maxPrice ? Number(route.query.maxPrice) : 2000000
);

const priceRanges = computed(() => [
  { label: t("price.all"), min: 0, max: 2000000 },
  { label: t("price.under"), min: 0, max: 1000 },
  { label: "1,000–2,000 \u0E3F", min: 1000, max: 2000 },
  { label: "2,000–3,000 \u0E3F", min: 2000, max: 3000 },
  { label: "3,000–4,000 \u0E3F", min: 3000, max: 4000 },
  { label: "4,000–6,000 \u0E3F", min: 4000, max: 6000 },
  { label: t("price.over"), min: 6000, max: 2000000 },
]);

const selectedRange = computed(() => {
  const range = priceRanges.value.find(
    (r) => r.min === minPrice.value && r.max === maxPrice.value
  );
  return range ? range.label : t("price.custom");
});

const applyPriceFilter = (min, max) => {
  minPrice.value = min;
  maxPrice.value = max;
  isDropdownVisible.value = false;

  const query = { ...route.query };

  if (min === 0 && max === 2000000) {
    delete query.minPrice;
    delete query.maxPrice;
  } else {
    query.minPrice = min;
    query.maxPrice = max;
  }

  router.push({ query });
};

watch(
  () => route.query,
  () => {
    minPrice.value = route.query.minPrice ? Number(route.query.minPrice) : 0;
    maxPrice.value = route.query.maxPrice
      ? Number(route.query.maxPrice)
      : 2000000;
  }
);

const isDropdownVisible = ref(false);
const dropdownRef = ref(null);

onClickOutside(dropdownRef, () => (isDropdownVisible.value = false));

const isActive = computed(() => {
  return minPrice.value !== 0 || maxPrice.value !== 2000000;
});

const isSelected = (range) =>
  (isActive.value && selectedRange.value === range.label) ||
  (!isActive.value && range.min === 0 && range.max === 2000000);
</script>

<template>
  <div class="relative flex items-center gap-1 select-none" ref="dropdownRef">
    <button
      type="button"
      class="filter-pill"
      :class="{
        'filter-pill--open': isDropdownVisible,
        'filter-pill--active': isActive,
      }"
      :aria-expanded="isDropdownVisible"
      aria-haspopup="listbox"
      @click="isDropdownVisible = !isDropdownVisible"
    >
      <UIcon name="i-iconamoon-discount" size="18" aria-hidden="true" />
      <span>{{ isActive ? selectedRange : t("price.label") }}</span>
      <UIcon name="i-iconamoon-arrow-down-2" size="16" aria-hidden="true" />
    </button>
    <button
      v-if="isActive"
      type="button"
      class="flex h-11 w-11 items-center justify-center rounded-full text-muted hover:bg-mist hover:text-navy dark:text-night-muted dark:hover:bg-midnight-surface dark:hover:text-night-text transition"
      :aria-label="t('price.clear')"
      @click="applyPriceFilter(0, 2000000)"
    >
      <UIcon name="i-iconamoon-close-bold" size="18" />
    </button>

    <Transition name="dropdown">
      <ul
        v-if="isDropdownVisible"
        role="listbox"
        :aria-label="t('price.label')"
        class="filter-menu right-0 sm:left-0 sm:right-auto"
      >
        <li v-for="range in priceRanges" :key="range.label">
          <button
            type="button"
            role="option"
            :aria-selected="isSelected(range)"
            class="filter-option"
            @click="applyPriceFilter(range.min, range.max)"
          >
            <span>{{ range.label }}</span>
            <UIcon
              v-if="isSelected(range)"
              name="i-iconamoon-check-bold"
              size="18"
              class="text-royal dark:text-night-price"
            />
          </button>
        </li>
      </ul>
    </Transition>
  </div>
</template>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
