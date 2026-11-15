<script setup>
import websiteStore from "~~/stores/website";

const route = useRoute();
const productsData = ref([]);
const isLoading = ref(false);
const hasFetched = ref(false);
const loadingMoreProducts = ref(false);
const page = ref(1);
const loadMore = ref(null);
const totalCount = ref(null);
let observer = null;

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

const heading = computed(() => {
  if (route.query.q) return `ผลการค้นหา “${route.query.q}”`;
  if (route.query.category) return categoryLabelTh(route.query.category);
  return "เครื่องประดับทั้งหมด";
});

// Count every match, not only the loaded page.
async function countProducts() {
  const all = await searchProducts({
    ...variables.value,
    page: 1,
    perPage: Number.MAX_SAFE_INTEGER,
  });
  totalCount.value = all.length;
}

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
  countProducts();
  setupObserver();
});

onBeforeUnmount(() => {
  if (observer) observer.disconnect();
});

watch(
  () => route.query,
  () => {
    page.value = 1;
    productsData.value = [];
    fetch();
    countProducts();
    window.scrollTo(0, 0);
  }
);

watch(page, () => {
  fetch();
});

const setupObserver = () => {
  if (observer) observer.disconnect();

  if (!loadMore.value) return;

  observer = new IntersectionObserver(async (entries) => {
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

  observer.observe(loadMore.value);
};

watch(loadMore, () => {
  setupObserver();
});

const products = computed(() => productsData.value);
const productsEmpty = computed(
  () => hasFetched.value && !isLoading.value && productsData.value.length === 0
);
</script>

<template>
  <section
    class="bg-mist dark:bg-midnight-surface/60 border-b border-sky/70 dark:border-midnight-line"
    aria-label="ข้อมูลร้าน"
  >
    <ul
      class="max-lg:hidden mx-auto flex max-w-[1440px] items-center justify-center gap-x-12 px-8 py-3 text-[15px] text-navy dark:text-night-text"
    >
      <li class="flex items-center gap-2.5">
        <svg class="trust-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 3 19 6v5.2c0 4.4-3 7.9-7 9.8-4-1.9-7-5.4-7-9.8V6l7-3Z" />
          <path d="m9 12 2.2 2.2L15.5 10" />
        </svg>
        ของแท้ ช็อปจากออสเตรเลีย
      </li>
      <li class="flex items-center gap-2.5">
        <svg class="trust-icon" viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3.5" y="8" width="17" height="4" rx="1" />
          <path d="M5 12v8h14v-8M12 8v12" />
          <path d="M12 8c-1-2.6-2.6-3.8-4-3.4-1.6.5-1.2 3.4 4 3.4Zm0 0c1-2.6 2.6-3.8 4-3.4 1.6.5 1.2 3.4-4 3.4Z" />
        </svg>
        ราคารวมกล่องและถุงแล้ว
      </li>
      <li class="flex items-center gap-2.5">
        <svg class="trust-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 3h12v18l-2.5-1.6L13 21l-2.5-1.6L8 21l-2-1.3V3Z" />
          <path d="M9 8h6M9 11.5h6M9 15h3.5" />
        </svg>
        ต้องการใบเสร็จ ทักสอบถามได้
      </li>
    </ul>
    <p
      class="lg:hidden flex items-center justify-center gap-2 px-4 py-2.5 text-[13px] text-navy dark:text-night-text"
    >
      <svg class="trust-icon h-[18px] w-[18px]" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3 19 6v5.2c0 4.4-3 7.9-7 9.8-4-1.9-7-5.4-7-9.8V6l7-3Z" />
        <path d="m9 12 2.2 2.2L15.5 10" />
      </svg>
      ของแท้จากออสเตรเลีย · ราคารวมกล่องและถุงแล้ว
    </p>
  </section>

  <div class="mx-auto max-w-[1440px] px-4 lg:px-8">
    <div
      class="flex flex-wrap items-end justify-between gap-x-6 gap-y-3 pt-6 pb-5 lg:pt-9 lg:pb-7"
    >
      <div class="min-w-0">
        <h1
          class="font-display-th text-[26px] lg:text-[34px] font-semibold leading-tight text-navy dark:text-night-text"
        >
          {{ heading }}
        </h1>
        <p
          class="mt-1 text-[15px] text-muted dark:text-night-muted"
          aria-live="polite"
        >
          <template v-if="totalCount !== null">{{ totalCount.toLocaleString("en-US") }} ชิ้น</template>
          <template v-else>&nbsp;</template>
        </p>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <ButtonSortBy />
        <PriceFilter />
      </div>
    </div>

    <div v-if="!productsEmpty" class="product-grid pb-10">
      <ProductCard :products="products" />
      <ProductsSkeleton
        v-if="(!products.length || isLoading) && !productsEmpty"
      />
      <!-- Trigger for loading more products -->
      <div ref="loadMore" class="col-span-full h-16"></div>
    </div>
    <ProductsEmpty v-else />
  </div>
</template>

<style lang="postcss" scoped>
.product-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 28px 12px;
}

@media (min-width: 640px) {
  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 40px 24px;
  }
}

.trust-icon {
  @apply h-5 w-5 shrink-0 fill-none stroke-gold dark:stroke-night-gold;
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
