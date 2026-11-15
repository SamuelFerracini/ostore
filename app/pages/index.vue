<script setup>
import websiteStore from "~~/stores/website";
import ShopLogo from "~/components/Logos/ShopLogo.vue";
import { useRouter } from "vue-router";

const router = useRouter();
const isRedirecting = ref(false);

const shops = computed(() => {
  return websiteStore.getters.shops;
});

const handleShopClick = (shop) => {
  websiteStore.dispatch("selectShop", shop);
  router.push(`/products?shop=${shop.id}`);
};

const handleOpenFacebook = () => {
  window.open("https://www.facebook.com/nonlapan.ssw", "_blank").focus();
};

// Auto-redirect if only one shop
onMounted(() => {
  if (shops.value.length === 1) {
    isRedirecting.value = true;
    const shop = shops.value[0];
    websiteStore.dispatch("selectShop", shop);
    router.push(`/products?shop=${shop.id}`);
  }
});
</script>

<template>
  <!-- Loading state during redirect -->
  <div
    v-if="isRedirecting"
    class="flex flex-col items-center justify-center min-h-[calc(100vh-220px)]"
    role="status"
  >
    <div
      class="flex h-16 w-16 items-center justify-center rounded-full border border-gold-line bg-white dark:border-midnight-line dark:bg-midnight-surface"
    >
      <UIcon
        class="text-royal dark:text-night-price"
        name="i-svg-spinners-8-dots-rotate"
        size="36"
      />
    </div>
    <p class="mt-6 text-lg font-medium text-muted dark:text-night-muted">
      กำลังโหลดสินค้า…
    </p>
  </div>

  <!-- Shop selection (only shows when multiple shops) -->
  <div v-else class="flex flex-col items-center px-4 pt-16 pb-10">
    <h1
      class="font-display-th text-[28px] lg:text-[34px] font-semibold text-navy dark:text-night-text"
    >
      เลือกร้านค้า
    </h1>
    <div class="mt-10 mb-12 flex flex-wrap justify-center gap-6 lg:gap-10">
      <button
        type="button"
        @click="handleShopClick(shop)"
        v-for="(shop, idx) in shops"
        :key="idx"
        class="w-72 rounded-3xl border border-gold-line bg-white p-8 transition hover:border-gold active:scale-[0.98] dark:border-midnight-line dark:bg-midnight-surface"
        :aria-label="shop.name"
      >
        <ShopLogo :shop="shop.id" />
      </button>
    </div>
    <button
      type="button"
      class="inline-flex min-h-[48px] items-center gap-3 rounded-full border border-gold pl-1.5 pr-6 text-lg font-medium text-gold-text hover:bg-gold-soft dark:text-night-gold dark:hover:bg-gold/10 transition"
      @click="handleOpenFacebook"
    >
      <span
        class="flex h-10 w-10 items-center justify-center rounded-full bg-gold text-navy"
        aria-hidden="true"
      >
        <svg viewBox="0 0 24 24" class="h-5 w-5" fill="currentColor">
          <path
            d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.6-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H8v3h2.5V21h3Z"
          />
        </svg>
      </span>
      ทักแชท Facebook
    </button>
  </div>
</template>
