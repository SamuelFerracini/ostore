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
</script>

<template>
  <div 
    class="relative cursor-pointer select-none items-center justify-center text-base font-semibold" 
    ref="dropdownRef"
    @click="isDropdownVisible = !isDropdownVisible"
  >
    <div
      class="box-border flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-all active:scale-95"
      :class="{
        'bg-black text-white hover:bg-black dark:bg-white dark:text-black hover:dark:bg-white': isDropdownVisible || isActive,
        'bg-[#efefef] hover:bg-[#e2e2e2] dark:bg-[#262626] hover:dark:bg-[#333]': !isDropdownVisible && !isActive,
      }"
    >
      <UIcon name="i-heroicons-tag" size="16" />
      <span class="text-xs font-semibold">{{ isActive ? selectedRange : 'Price' }}</span>
      <UIcon v-if="isActive" name="i-heroicons-x-mark" size="14" class="ml-1" @click.stop="applyPriceFilter(0, 2000000)" />
    </div>

    <Transition name="dropdown">
      <div
        v-if="isDropdownVisible"
        class="absolute top-full left-0 z-10 mt-3 lg:mt-[18px] w-48 rounded-2xl text-base font-semibold bg-white dark:bg-[#262626] shadow-[0_0_8px_rgba(0,0,0,.1)]"
        @click.stop
      >
        <div class="m-2">
            <div
            v-for="range in priceRanges"
            :key="range.label"
            @click="applyPriceFilter(range.min, range.max)"
            class="rounded-[10px] px-3 py-2 transition-all duration-300 hover:bg-[#e9e9e9] hover:dark:bg-[#3c3c3c]"
            >
            <div class="flex items-center justify-between">
                <div class="mr-1 w-full text-sm">{{ range.label }}</div>
                <UIcon
                v-if="(isActive && selectedRange === range.label) || (!isActive && range.label === 'All Prices')"
                name="i-iconamoon-check-circle-1-fill"
                size="20"
                class="text-purple-600 dark:text-purple-400"
                />
            </div>
            </div>
        </div>
      </div>
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
