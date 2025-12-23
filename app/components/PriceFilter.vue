<script setup>
const route = useRoute();
const router = useRouter();

const minPrice = ref(route.query.minPrice ? Number(route.query.minPrice) : 0);
const maxPrice = ref(
  route.query.maxPrice ? Number(route.query.maxPrice) : 2000000
);

const priceRanges = [
  { label: "All Prices", min: 0, max: 2000000 },
  { label: "Under 1,000 THB", min: 0, max: 1000 },
  { label: "1,000 - 2,000 THB", min: 1000, max: 2000 },
  { label: "2,000 - 3,000 THB", min: 2000, max: 3000 },
  { label: "3,000 - 4,000 THB", min: 3000, max: 4000 },
  { label: "4,000 - 6,000 THB", min: 4000, max: 6000 },
  { label: "Over 6,000 THB", min: 6000, max: 2000000 },
];

const selectedRange = computed(() => {
  const range = priceRanges.find(
    (r) => r.min === minPrice.value && r.max === maxPrice.value
  );
  return range ? range.label : "Custom Range";
});

const applyPriceFilter = (min, max) => {
  minPrice.value = min;
  maxPrice.value = max;

  const query = { ...route.query };

  if (min === 0 && max === 20000) {
    delete query.minPrice;
    delete query.maxPrice;
  } else {
    query.minPrice = min;
    query.maxPrice = max;
  }

  router.push({ query });
};

const clearFilter = () => {
  applyPriceFilter(0, 20000);
};

watch(
  () => route.query,
  () => {
    minPrice.value = route.query.minPrice ? Number(route.query.minPrice) : 0;
    maxPrice.value = route.query.maxPrice
      ? Number(route.query.maxPrice)
      : 20000;
  }
);
</script>

<template>
  <div class="px-3 lg:px-5 pb-2 pt-2">
    <div class="flex items-center gap-2 flex-wrap">
      <button
        v-for="range in priceRanges"
        :key="range.label"
        @click="applyPriceFilter(range.min, range.max)"
        :class="[
          'px-3 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95',
          selectedRange === range.label
            ? 'bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-700 hover:dark:bg-purple-800'
            : 'bg-black/5 dark:bg-white/10 hover:bg-black/10 hover:dark:bg-white/15 text-[#5f5f5f] dark:text-[#b7b7b7]',
        ]"
      >
        {{ range.label }}
      </button>

      <button
        v-if="minPrice !== 0 || maxPrice !== 10000"
        @click="clearFilter"
        class="px-3 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95 bg-red-500 hover:bg-red-600 text-white flex items-center gap-1.5"
        aria-label="Clear price filter"
      >
        <UIcon name="i-iconamoon-close-bold" size="14" />
        Clear
      </button>
    </div>
  </div>
</template>
