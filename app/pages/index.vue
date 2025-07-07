<script setup>
import websiteStore from "~~/stores/website";
import ShopLogo from "~/components/Logos/ShopLogo.vue";
import { useRouter } from "vue-router";

const router = useRouter();

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
</script>

<template>
  <div class="flex justify-center">
    <div class="grid md:grid-cols-2 gap-16 items-center justify-center pt-20">
      <button
        @click="handleShopClick(shop)"
        v-for="(shop, idx) in shops"
        :key="idx"
        class="w-72"
      >
        <ShopLogo :shop="shop.id" />
      </button>

      <button
        class="w-72 border-2 border-purple-400 dark:border-purple-200 p-4 rounded-full"
        @click="handleOpenFacebook"
      >
        <p class="text-4xl font-medium text-purple-400 dark:text-purple-200">
          Contact Us
        </p>
      </button>
    </div>
  </div>
</template>
