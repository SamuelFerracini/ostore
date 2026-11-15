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

const colorMode = useColorMode();

const toggleDark = () => {
  colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
};

colorMode.preference = "dark";

const colorModeIcon = computed(() =>
  colorMode.preference === "dark"
    ? "i-iconamoon-mode-dark-fill"
    : "i-iconamoon-mode-light-fill"
);

const showSearch = computed(() => {
  return route.path === "/products" || route.path === "/products/";
});
</script>

<template>
  <div
    class="flex w-full flex-row items-center px-3 lg:px-5 h-[80px] lg:h-20 z-40 fixed bg-white/85 dark:bg-black/85 backdrop-blur-sm dark:backdrop-blur-lg"
  >
    <div class="flex flex-row w-full flex-nowrap items-center">
      <NuxtLink
        aria-label="Home"
        class="flex items-center justify-center min-w-[52px] min-h-[52px] max-lg:min-w-12 max-lg:min-h-12 rounded-2xl max-lg:rounded-full transition active:scale-95 px-3"
        to="/"
      >
        <img src="/logo.png" alt="Nonlapan" class="w-16" />
      </NuxtLink>
      <div
        class="flex flex-shrink flex-grow flex-col text-sm font-semibold text-[#111] dark:text-[#eee] mr-2"
      >
        <div
          v-if="showSearch"
          :class="[
            'flex h-12 flex-grow rounded-full  pl-4 pr-3 transition-all hover:bg-black/10 hover:dark:bg-white/20',
            suggestionMenu
              ? 'bg-black/10 dark:bg-white/20'
              : 'bg-black/5 dark:bg-white/15',
          ]"
        >
          <div
            @click="suggestionMenu = true"
            class="flex w-full items-center gap-4"
          >
            <div
              v-if="!suggestionMenu"
              class="flex text-neutral-500 dark:text-neutral-400"
            >
              <UIcon name="i-iconamoon-search-bold" size="20" />
            </div>
            <div class="flex w-full">
              <input
                class="w-full bg-transparent py-2 outline-none placeholder:text-[#757575] placeholder:dark:text-neutral-400"
                type="text"
                v-model="searchQuery"
                @input="search"
                :placeholder="
                  route.query.category
                    ? `Search in ${getCategoryName(
                        route.query.category
                      ).toLowerCase()}...`
                    : 'Search...'
                "
              />
              <div
                v-if="searchQuery || suggestionMenu"
                @click.stop="clearSearch"
                class="flex items-center justify-center cursor-pointer transition-all"
              >
                <UIcon
                  v-if="!isLoading"
                  class="text-black dark:text-white"
                  name="i-iconamoon-close-circle-1-fill"
                  size="24"
                />
                <UIcon
                  v-else
                  name="i-svg-spinners-bars-rotate-fade"
                  size="20"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <button
        @click="toggleDark"
        class="hover:bg-black/5 hover:dark:bg-white/15 max-lg:dark:bg-white/15 max-lg:bg-black/5 max-lg:hover:bg-black/10 max-lg:hover:dark:bg-white/20 min-w-12 min-h-12 flex items-center justify-center rounded-full cursor-pointer transition-all active:scale-95 mr-2"
        aria-label="Toggle dark mode"
      >
        <UIcon
          :name="colorModeIcon"
          class="text-[#5f5f5f] dark:text-[#b7b7b7] transition-all duration-300"
          size="24"
        />
      </button>
      <NuxtLink
        to="/cart"
        class="hover:bg-black/5 hover:dark:bg-white/15 max-lg:dark:bg-white/15 max-lg:bg-black/5 max-lg:hover:bg-black/10 max-lg:hover:dark:bg-white/20 min-w-12 min-h-12 flex items-center justify-center rounded-full cursor-pointer relative transition-all"
        :class="cartCountAnimating ? 'cart-icon-shake' : ''"
      >
        <UIcon
          class="text-[#5f5f5f] dark:text-[#b7b7b7] transition-transform duration-200"
          :class="cartCountAnimating ? 'scale-110' : ''"
          name="i-iconamoon-shopping-bag-bold"
          size="26"
        />
        <Transition name="badge">
          <span
            v-if="cartCount > 0"
            class="absolute top-1 right-1 flex h-[18px] w-[18px]"
          >
            <span
              v-if="cartCountAnimating"
              class="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"
            ></span>
            <span
              class="relative inline-flex rounded-full h-[18px] w-[18px] bg-purple-600 text-[10px] items-center justify-center shadow font-semibold text-white transition-all"
              :class="cartCountAnimating ? 'badge-pulse' : ''"
            >
              {{ cartCount }}
            </span>
          </span>
        </Transition>
      </NuxtLink>
    </div>
  </div>
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
  @apply bg-black/15 dark:bg-white/15 rounded-full border-solid border-white dark:border-black;
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
