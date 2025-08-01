<script setup>
import websiteStore from "~~/stores/website";

const route = useRoute();
const productsData = ref([]);
const isLoading = ref(false);
const hasFetched = ref(false);
const loadingMoreProducts = ref(false);
const page = ref(1);
const loadMore = ref(null);

const variables = computed(() => ({
  search: route.query.q,
  category: route.query.category,
  shop: websiteStore.getters.selectedShop.id,
  perPage: 50,
}));

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
});

watch(
  () => route.query,
  () => {
    page.value = 1;
    productsData.value = [];
    fetch();
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
  <div class="flex items-center pl-3 lg:pl-5">
    <ButtonSelectCategory />
  </div>
  <div
    v-if="!productsEmpty"
    class="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7 gap-3 lg:gap-5 p-3 lg:p-5"
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
