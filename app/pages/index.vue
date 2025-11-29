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
    class="flex flex-col items-center justify-center min-h-[calc(100vh-160px)]"
  >
    <div
      class="bg-black/10 dark:bg-white/20 flex rounded-full w-16 h-16 items-center justify-center"
    >
      <UIcon
        class="text-purple-600 dark:text-purple-400"
        name="i-svg-spinners-8-dots-rotate"
        size="40"
      />
    </div>
    <p class="mt-6 text-lg font-semibold text-[#5f5f5f] dark:text-[#b7b7b7]">
      Loading products...
    </p>
  </div>

  <!-- Shop selection (only shows when multiple shops) -->
  <div v-else class="flex flex-col items-center pt-20">
    <div class="flex flex-wrap justify-center gap-16 mb-12">
      <button
        @click="handleShopClick(shop)"
        v-for="(shop, idx) in shops"
        :key="idx"
        class="w-72"
      >
        <ShopLogo :shop="shop.id" />
      </button>
    </div>
    <button
      class="w-72 border-2 border-purple-400 dark:border-purple-200 p-4 rounded-full"
      @click="handleOpenFacebook"
    >
      <p class="text-4xl font-medium text-purple-400 dark:text-purple-200">
        Contact Us
      </p>
    </button>
  </div>
</template>
