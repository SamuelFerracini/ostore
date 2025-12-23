<script setup>
import websiteStore from "~~/stores/website";

const route = useRoute();
const productsData = ref([]);
const isLoading = ref(false);
const hasFetched = ref(false);
const loadingMoreProducts = ref(false);
const page = ref(1);
const loadMore = ref(null);
const showFilters = ref(true);
const lastScrollY = ref(0);
const manuallyOpened = ref(false);
const isMobile = ref(false);
const filterBarRef = ref(null);
const filterContentHeight = ref("auto");

const variables = computed(() => ({
  search: route.query.q,
  category: route.query.category,
  shop: websiteStore.getters.selectedShop.id,
  perPage: 50,
  minPrice: route.query.minPrice ? Number(route.query.minPrice) : undefined,
  maxPrice: route.query.maxPrice ? Number(route.query.maxPrice) : undefined,
  orderby: route.query.orderby || 'ASC',
  fieldby: route.query.fieldby || 'PRICE',
}));

const activeFiltersCount = computed(() => {
  let count = 0;
  if (route.query.category) count++;
  if (route.query.minPrice || route.query.maxPrice) count++;
  return count;
});

const checkIfMobile = () => {
  isMobile.value = window.innerWidth < 1024; // lg breakpoint
  // Always show filters on desktop
  if (!isMobile.value) {
    showFilters.value = true;
  }
  measureContentHeight();
};

const filtersFullyExpanded = ref(false);

const measureContentHeight = () => {
  nextTick(() => {
    if (filterBarRef.value) {
      if (isMobile.value && showFilters.value) {
        const content = filterBarRef.value.querySelector(
          ".filter-content-wrapper"
        );
        if (content) {
          filterContentHeight.value = `${content.offsetHeight}px`;
        }
      } else if (!isMobile.value) {
        // Measure desktop height
        filterContentHeight.value = `${filterBarRef.value.scrollHeight}px`;
      }
    }
  });
};

const spacerHeight = computed(() => {
  if (!isMobile.value) {
    return "60px";
  }
  return showFilters.value ? filterContentHeight.value : "48px";
});

const toggleFilters = () => {
  // Only allow toggle on mobile
  if (!isMobile.value) return;

  showFilters.value = !showFilters.value;

  if (showFilters.value) {
    manuallyOpened.value = true;
    measureContentHeight();
    // Wait for transition to finish
    setTimeout(() => {
      filtersFullyExpanded.value = true;
    }, 450);
  } else {
    filtersFullyExpanded.value = false;
    manuallyOpened.value = false;
  }
};

const handleScroll = () => {
  // Only auto-hide on mobile
  if (!isMobile.value) return;

  const currentScrollY = window.scrollY;

  // Don't auto-close if manually opened
  if (
    currentScrollY > 150 &&
    currentScrollY > lastScrollY.value &&
    !manuallyOpened.value
  ) {
    // Scrolling down
    showFilters.value = false;
    filtersFullyExpanded.value = false;
  }

  // Reset manual flag if scrolling back to top
  if (currentScrollY < 150) {
    manuallyOpened.value = false;
    showFilters.value = true;
    setTimeout(() => {
      filtersFullyExpanded.value = true;
    }, 450);
  }

  lastScrollY.value = currentScrollY;
};

async function fetch() {
  if (isLoading.value) return;
  isLoading.value = true;

  try {
    const response = await searchProducts({
      ...variables.value,
      page: page.value,
    });
    productsData.value.push(...response);
    hasFetched.value = true;
  } finally {
    isLoading.value = false;
  }
}

onMounted(async () => {
  if (route.query.shop) {
    const shop = websiteStore.getters.shops.find(
      (e) => e.id === route.query.shop
    );

    websiteStore.dispatch("selectShop", shop);
  }

  await loadProducts();
  await fetch();
  setupObserver();

  // Check if mobile and setup listeners
  checkIfMobile();

  // Measure height after a short delay to ensure DOM is rendered
  setTimeout(() => {
    measureContentHeight();
    if (showFilters.value) {
        filtersFullyExpanded.value = true;
    }
  }, 100);

  window.addEventListener("scroll", handleScroll);
  window.addEventListener("resize", checkIfMobile);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
  window.removeEventListener("resize", checkIfMobile);
});

watch(
  () => route.query,
  () => {
    page.value = 1;
    productsData.value = [];
    fetch();
    measureContentHeight();
  }
);

watch(page, () => {
  fetch();
});

const setupObserver = () => {
  const observer = new IntersectionObserver(async (entries) => {
    entries.forEach(async (entry) => {
      if (
        entry.isIntersecting &&
        !isLoading.value &&
        !loadingMoreProducts.value
      ) {
        page.value = page.value + 1;
      }
    });
  });

  if (loadMore.value) {
    observer.observe(loadMore.value);
  }
};

const products = computed(() => productsData.value);
const productsEmpty = computed(
  () => hasFetched.value && !isLoading.value && productsData.value.length === 0
);
</script>

<template>
  <!-- Fixed filter bar -->
  <div
    ref="filterBarRef"
    class="fixed top-[80px] lg:top-20 left-0 right-0 z-30 bg-white/85 dark:bg-black/85 backdrop-blur-sm dark:backdrop-blur-lg border-b border-black/5 dark:border-white/10 transition-all duration-400 ease-out"
    :class="{
        'overflow-y-hidden': !filtersFullyExpanded && isMobile,
         'overflow-visible': filtersFullyExpanded || !isMobile
    }"
    :style="{
      maxHeight: !isMobile
        ? 'none'
        : showFilters
        ? filterContentHeight
        : '48px',
    }"
  >
    <!-- Desktop: Always visible -->
    <div v-if="!isMobile" class="pt-1 pb-2">
      <ButtonSelectCategory />
      <div class="px-3 lg:px-5 pb-2 pt-2 flex items-center gap-2 flex-wrap">
        <ButtonSortBy />
        <PriceFilter />
      </div>
    </div>

    <!-- Mobile: Toggleable -->
    <Transition v-if="isMobile" name="filter-content">
      <div v-if="showFilters" class="filter-content-wrapper pt-1">
        <ButtonSelectCategory />
        <div class="px-3 lg:px-5 pb-2 pt-2 flex items-center gap-2 flex-wrap">
          <ButtonSortBy />
          <PriceFilter />
        </div>
        <div class="flex justify-end items-center px-3 lg:px-5 pb-2 pt-1">
          <button
            @click="toggleFilters"
            class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 hover:dark:bg-white/15 transition active:scale-95"
            aria-label="Hide filters"
          >
            <span
              class="text-xs font-semibold text-[#5f5f5f] dark:text-[#b7b7b7]"
            >
              Hide filters
            </span>
            <UIcon
              name="i-iconamoon-arrow-up-2-bold"
              class="text-[#5f5f5f] dark:text-[#b7b7b7]"
              size="16"
            />
          </button>
        </div>
      </div>
    </Transition>

    <!-- Drawer handle - visible when closed (mobile only) -->
    <Transition v-if="isMobile" name="handle">
      <div
        v-if="!showFilters"
        class="flex items-center justify-end h-12 px-3 lg:px-5"
      >
        <button
          @click="toggleFilters"
          class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 hover:dark:bg-white/15 transition active:scale-95 group"
          aria-label="Show filters"
        >
          <UIcon
            name="i-iconamoon-filter-fill"
            class="text-[#5f5f5f] dark:text-[#b7b7b7]"
            size="16"
          />
          <span
            class="text-xs font-semibold text-[#5f5f5f] dark:text-[#b7b7b7]"
          >
            Show filters
          </span>
          <span
            v-if="activeFiltersCount > 0"
            class="flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-purple-600 text-white text-[10px] font-bold"
          >
            {{ activeFiltersCount }}
          </span>
          <UIcon
            name="i-iconamoon-arrow-down-2-bold"
            class="text-[#5f5f5f] dark:text-[#b7b7b7]"
            size="14"
          />
        </button>
      </div>
    </Transition>
  </div>

  <!-- Spacer for fixed filter bar -->
  <div
    class="transition-all ease-out"
    :style="{
      height: spacerHeight,
      transitionDuration: isMobile ? '400ms' : '0ms',
    }"
  ></div>

  <div
    v-if="!productsEmpty"
    class="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7 gap-3 lg:gap-5 p-3 lg:p-5 lg:mt-10"
  >
    <ProductCard :products="products" />
    <!-- Trigger for loading more products -->
    <div ref="loadMore" class="h-16"></div>
    <ProductsSkeleton
      v-if="(!products.length || isLoading) && !productsEmpty"
    />
    <div class="col-span-full mt-10"></div>
  </div>
  <ProductsEmpty v-else />
</template>

<style lang="postcss" scoped>
/* Filter content transitions */
.filter-content-enter-active {
  @apply transition-all duration-300 ease-out;
  transition-delay: 0.05s;
}
.filter-content-leave-active {
  @apply transition-all duration-200 ease-in;
}
.filter-content-enter-from,
.filter-content-leave-to {
  @apply opacity-0;
  transform: translateY(-5px);
}
.filter-content-enter-to,
.filter-content-leave-from {
  @apply opacity-100;
  transform: translateY(0);
}

/* Handle transitions */
.handle-enter-active {
  @apply transition-all duration-300 ease-out;
  transition-delay: 0.05s;
}
.handle-leave-active {
  @apply transition-all duration-200 ease-in;
}
.handle-enter-from,
.handle-leave-to {
  @apply opacity-0;
  transform: translateY(-5px);
}
.handle-enter-to,
.handle-leave-from {
  @apply opacity-100;
  transform: translateY(0);
}
</style>
