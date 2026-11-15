<script setup>
import cartStore from "~~/stores/cart";

const router = useRouter();
const route = useRoute();
const searchQuery = ref((route.query.q || "").toString());
const searchResults = ref([]);
const isLoading = ref(false);
const suggestionMenu = ref(false);
const onClickOutsideRef = ref(null);
const cartModal = ref(false);
const { cart } = useCart();

const cartCount = computed(() => cartStore.getters.cartCount);
const cartCountAnimating = ref(false);

watch(cartCount, () => {
  cartCountAnimating.value = true;
  setTimeout(() => {
    cartCountAnimating.value = false;
  }, 500);
});

const search = () => {
  router.push({
    path: "/products",
    query: { ...route.query, q: searchQuery.value || undefined },
  });
  suggestionMenu.value = false;
};

async function fetch() {
  try {
    searchResults.value = await searchProducts({ search: searchQuery.value });
  } finally {
    isLoading.value = false;
  }
}

onMounted(fetch);

const throttledFetch = useDebounceFn(async () => {
  await fetch();
}, 300);

watch(
  () => searchQuery.value,
  () => {
    isLoading.value = true;
    throttledFetch();
  }
);

watch(
  () => route.query.q,
  (newVal) => {
    searchQuery.value = (newVal || "").toString();
  }
);

// Clear search when category changes
watch(
  () => route.query.category,
  (newVal) => {
    if (newVal && searchQuery.value) {
      searchQuery.value = "";
      router.push({ query: { ...route.query, q: undefined } });
    }
  }
);

const clearSearch = () => {
  suggestionMenu.value = false;
  searchQuery.value = "";
  router.push({ query: { ...route.query, q: undefined } });
};

onClickOutside(onClickOutsideRef, (event) => {
  suggestionMenu.value = false;
  cartModal.value = false;
});

const config = useRuntimeConfig();
const colorMode = useColorMode();

// The dark-mode toggle lives in AppFooter.vue.
colorMode.preference = "dark";

const showSearch = computed(() => {
  return route.path === "/products" || route.path === "/products/";
});

const searchPlaceholder = computed(() =>
  route.query.category
    ? `ค้นหาใน${categoryLabelTh(route.query.category)}…`
    : "ค้นหาแหวน ชาร์ม กำไล…"
);
</script>

<template>
  <header
    class="sticky top-0 z-40 w-full bg-white/95 dark:bg-midnight-surface/95 backdrop-blur-md border-b border-gold-line dark:border-midnight-line"
  >
    <div class="h-1 bg-gold" aria-hidden="true"></div>
    <div
      class="mx-auto flex max-w-[1440px] flex-wrap lg:flex-nowrap items-center gap-x-3 gap-y-2 px-4 lg:px-8 py-2.5 lg:py-3"
    >
      <NuxtLink
        aria-label="หน้าแรก Pandora with Nonlapan"
        class="flex min-h-[44px] items-center gap-2.5 rounded-full pr-2 shrink-0"
        to="/"
      >
        <svg
          class="h-8 w-11 lg:h-9 lg:w-12 text-gold dark:text-night-gold"
          viewBox="0 0 48 32"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M5 27c9-3.5 29-3.5 38 0" />
          <path d="M6 27 9 13l7 7.5L24 7l8 13.5 7-7.5 3 14" />
          <circle cx="24" cy="4.2" r="1.9" />
          <circle cx="9" cy="11" r="1.4" />
          <circle cx="39" cy="11" r="1.4" />
          <path d="m24 16 2 3-2 3-2-3Z" />
        </svg>
        <span class="flex flex-col leading-none">
          <span
            class="font-display text-[26px] lg:text-[28px] font-semibold tracking-[0.01em] text-navy dark:text-night-text"
            >Pandora</span
          >
          <span
            class="font-display italic font-medium text-[15px] -mt-0.5 text-gold-text dark:text-night-gold"
            >with Nonlapan</span
          >
        </span>
      </NuxtLink>

      <div
        class="order-last lg:order-none basis-full lg:basis-auto flex-1 min-w-0 text-sm text-navy dark:text-night-text lg:max-w-[560px] lg:mx-auto"
      >
        <div
          v-if="showSearch"
          :class="[
            'flex h-11 items-center rounded-full border pl-4 pr-1 transition-colors bg-field dark:bg-midnight',
            suggestionMenu
              ? 'border-periwinkle'
              : 'border-sky dark:border-midnight-line hover:border-periwinkle',
          ]"
        >
          <div
            @click="suggestionMenu = true"
            class="flex w-full items-center gap-3"
          >
            <UIcon
              name="i-iconamoon-search-bold"
              class="shrink-0 text-muted dark:text-night-muted"
              size="20"
            />
            <label for="site-search" class="sr-only">ค้นหาสินค้า</label>
            <input
              id="site-search"
              class="w-full min-w-0 bg-transparent py-2 outline-none focus-visible:outline-none placeholder:text-muted placeholder:dark:text-night-muted"
              type="search"
              v-model="searchQuery"
              @input="search"
              :placeholder="searchPlaceholder"
            />
            <button
              v-if="searchQuery || suggestionMenu"
              type="button"
              @click.stop="clearSearch"
              class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-navy dark:text-night-text hover:bg-mist dark:hover:bg-midnight-surface transition"
              aria-label="ล้างคำค้นหา"
            >
              <UIcon
                v-if="!isLoading"
                name="i-iconamoon-close-circle-1-fill"
                size="22"
              />
              <UIcon v-else name="i-svg-spinners-bars-rotate-fade" size="20" />
            </button>
          </div>
        </div>
      </div>

      <nav class="ml-auto lg:ml-0 flex items-center gap-2 shrink-0" aria-label="เมนูหลัก">
        <NuxtLink
          to="/favorites"
          class="flex h-11 min-w-[44px] items-center justify-center gap-2 rounded-full border border-sky dark:border-midnight-line bg-white dark:bg-transparent px-3 lg:px-4 text-sm font-medium text-navy dark:text-night-text hover:border-periwinkle transition active:scale-95"
          aria-label="รายการโปรด"
        >
          <UIcon name="i-iconamoon-heart" size="20" />
          <span class="max-sm:hidden">รายการโปรด</span>
        </NuxtLink>
        <NuxtLink
          to="/cart"
          class="relative flex h-11 items-center gap-2 rounded-full bg-royal pl-3.5 pr-2.5 text-sm font-medium text-white hover:bg-royal-blue-600 dark:ring-1 dark:ring-periwinkle/60 dark:hover:bg-royal-blue-400 transition active:scale-95"
          :class="cartCountAnimating ? 'cart-icon-shake' : ''"
          :aria-label="cartCount > 0 ? `ตะกร้า ${cartCount} ชิ้น` : 'ตะกร้า'"
        >
          <UIcon
            class="transition-transform duration-200"
            :class="cartCountAnimating ? 'scale-110' : ''"
            name="i-iconamoon-shopping-bag-bold"
            size="20"
          />
          <span>ตะกร้า</span>
          <Transition name="badge">
              <span
                v-if="cartCount > 0"
                class="relative flex h-[22px] min-w-[22px]"
              >
                <span
                  v-if="cartCountAnimating"
                  class="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-light opacity-75"
                ></span>
                <span
                  class="relative inline-flex h-[22px] min-w-[22px] px-1.5 rounded-full bg-gold text-[12px] items-center justify-center font-semibold text-navy transition-all"
                  :class="cartCountAnimating ? 'badge-pulse' : ''"
                >
                  {{ cartCount }}
                </span>
              </span>
            </Transition>
        </NuxtLink>
      </nav>
    </div>
    <div
      v-if="showSearch"
      class="border-t border-gold-line/70 dark:border-midnight-line"
    >
      <div class="mx-auto max-w-[1440px] py-2">
        <ButtonSelectCategory />
      </div>
    </div>
  </header>
  <!-- <div
    v-if="suggestionMenu"
    ref="onClickOutsideRef"
    class="fixed top-[72px] lg:top-20 left-0 right-0 z-50 bg-white/85 dark:bg-black/85 backdrop-blur-sm dark:backdrop-blur-lg lg:rounded-b-3xl w-full"
  >
    <div
      class="max-h-[calc(100vh-72px)] lg:max-h-[calc(100vh-80px)] overflow-auto"
    >
      <div v-if="isLoading" class="flex items-center justify-center h-80">
        <div
          class="bg-black/10 dark:bg-white/20 flex rounded-full w-12 h-12 items-center justify-center skeleton"
        >
          <UIcon
            class="text-white dark:text-black"
            name="i-svg-spinners-8-dots-rotate"
            size="26"
          />
        </div>
      </div>
      <div
        v-else-if="!searchResults.length"
        class="w-full items-center flex flex-col justify-center text-center p-8"
      >
        <div
          class="w-28 h-28 bg-black/10 dark:bg-white/20 rounded-full items-center justify-center flex"
        >
          <UIcon
            name="i-iconamoon-search-bold"
            class="w-16 h-16 dark:text-white"
          />
        </div>
        <div class="font-semibold text-3xl my-6">
          No items matching for:
          <strong>{{ searchQuery }}</strong>
        </div>
        <div class="text-sm text-center mb-5">
          Try improving your results by double checking your spelling
          <br />
          or trying a more general keyword.
        </div>
      </div>
      <div v-else class="mx-auto p-3 lg:p-4 max-w-screen-2xl">
        <h2 v-if="!searchQuery" class="text-2xl font-bold tracking-tight">
          New Products
        </h2>
        <div
          class="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 lg:gap-5 mt-3 lg:mt-5"
        >
          <NuxtLink
            @click="suggestionMenu = false"
            :to="`/product/${product.slug}-${product.sku.split('-')[0]}`"
            v-for="(product, i) in searchResults"
            :key="i"
            class="group select-none"
          >
            <div class="cursor-pointer transition ease-[ease] duration-300">
              <div
                class="relative pb-[133%] dark:shadow-[0_8px_24px_rgba(0,0,0,.5)] rounded-2xl overflow-hidden"
              >
                <NuxtImg
                  :alt="product.name"
                  loading="lazy"
                  :title="product.name"
                  :src="product.galleryImages.nodes[0].sourceUrl"
                  class="absolute h-full w-full dark:bg-neutral-800 bg-neutral-200 object-cover"
                />
                <NuxtImg
                  :alt="product.name"
                  loading="lazy"
                  :title="product.name"
                  :src="product.image.sourceUrl"
                  class="absolute h-full w-full dark:bg-neutral-800 bg-neutral-200 object-cover transition-opacity duration-300 group-hover:opacity-0"
                />
              </div>
              <div class="grid gap-0.5 pt-3 pb-4 px-1.5 text-sm font-semibold">
                <div class="flex gap-1">
                  <div v-html="product.salePrice"></div>
                  <div
                    class="text-[#5f5f5f] dark:text-[#a3a3a3] line-through"
                    v-html="product.regularPrice"
                  ></div>
                </div>
                <div>{{ product.name }}</div>
                <div class="font-normal text-[#5f5f5f] dark:text-[#a3a3a3]">
                  {{ product.allPaStyle.nodes[0].name }}
                </div>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
      <div
        v-if="searchQuery && !isLoading && searchResults.length"
        class="flex items-center justify-center border-t border-black/10 dark:border-white/20 p-4"
      >
        <button
          @click="search"
          class="bg-black/15 dark:bg-white/15 hover:bg-black/10 hover:dark:bg-white/20 px-4 py-2 rounded-full active:scale-95 tracking-wide text-sm transition"
        >
          View All Results
        </button>
      </div>
    </div>
  </div> -->
  <!-- <div
    v-if="suggestionMenu || cartModal"
    :class="['fixed inset-0 ', cartModal ? 'z-40' : 'z-30']"
  >
    <div class="w-full h-full bg-black/30 backdrop-blur-lg"></div>
  </div> -->
  <button
    v-if="cartModal"
    class="hover:bg-white/65 dark:hover:bg-white/10 transition shadow-2xl mt-3 lg:mt-4 mx-3 lg:mx-5 items-center justify-center min-w-12 min-h-12 rounded-[2rem] right-0 fixed flex z-50 bg-white/85 dark:bg-black/30 dark:border dark:border-white/10 cart-button-bezel backdrop-blur-lg"
  >
    <UIcon
      class="text-[#5f5f5f] dark:text-[#b7b7b7]"
      name="i-iconamoon-close"
      size="26"
    />
  </button>
  <Transition name="dropdown">
    <Cart v-if="cartModal" ref="onClickOutsideRef" />
  </Transition>
</template>

<style lang="postcss">
::-webkit-scrollbar {
  @apply w-0 h-0 bg-transparent;
}
::-webkit-scrollbar-track {
  @apply bg-transparent;
}
::-webkit-scrollbar-thumb {
  @apply bg-navy/15 dark:bg-white/15 rounded-full border-solid border-ivory dark:border-midnight;
  border-width: 5px;
}

/* Cart icon shake animation */
@keyframes cartShake {
  0%,
  100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-10deg);
  }
  75% {
    transform: rotate(10deg);
  }
}

.cart-icon-shake {
  animation: cartShake 0.5s ease-in-out;
}

/* Badge pulse animation */
@keyframes badgePulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

.badge-pulse {
  animation: badgePulse 0.5s ease-in-out;
}

/* Badge transition */
.badge-enter-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.badge-leave-active {
  transition: all 0.2s ease-in;
}

.badge-enter-from {
  opacity: 0;
  transform: scale(0);
}

.badge-leave-to {
  opacity: 0;
  transform: scale(0);
}
</style>
