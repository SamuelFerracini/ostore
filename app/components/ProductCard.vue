<script setup>
import cartStore from "~~/stores/cart";

defineProps({
  products: Object,
});

const addToCart = (product) => {
  cartStore.dispatch("addToCart", {
    id: product.id,
    name: product.name,
    price: parseFloat(product.price),
    originalPrice: product.originalPrice
      ? parseFloat(product.originalPrice)
      : undefined,
    primaryImage: product.primaryImage,
    category: product.category,
    shop: product.shop,
  });
};

const removeFromCart = (productId) => {
  cartStore.dispatch("removeFromCart", productId);
};

const isInCart = (productId) => {
  return cartStore.getters.isInCart(productId);
};
</script>

<template>
  <article v-for="product in products">
    <NuxtLink>
      <div class="transition ease-[ease] duration-300">
        <div
          class="relative pb-[133%] dark:shadow-[0_8px_24px_rgba(0,0,0,.5)] rounded-2xl overflow-hidden group select-none"
        >
          <NuxtImg
            :alt="product.name"
            loading="lazy"
            :title="product.name"
            :src="product.hoverImage ?? product.primaryImage"
            class="absolute h-full w-full dark:bg-neutral-800 bg-neutral-200 object-cover"
            :class="
              product.shop === 'gnoce' ? 'dark:bg-white' : 'dark:bg-neutral-800'
            "
          />
          <NuxtImg
            :alt="product.name"
            loading="lazy"
            :title="product.name"
            :src="product.primaryImage"
            class="absolute h-full w-full dark:bg-neutral-800 bg-neutral-200 object-cover transition-opacity duration-300 group-hover:opacity-0"
            :class="
              product.shop === 'gnoce' ? 'dark:bg-white' : 'dark:bg-neutral-800'
            "
          />

          <!-- Link Button -->
          <a
            v-if="product.link"
            :href="product.link"
            target="_blank"
            rel="noopener noreferrer"
            @click.stop
            class="absolute bottom-3 left-3 flex items-center justify-center w-10 h-10 rounded-full transition-all active:scale-95 shadow-lg bg-blue-600 hover:bg-blue-700"
            aria-label="Open product link"
          >
            <UIcon
              name="i-iconamoon-link-external-bold"
              class="text-white"
              size="20"
            />
          </a>

          <!-- Cart Button -->
          <button
            @click.prevent="
              isInCart(product.id)
                ? removeFromCart(product.id)
                : addToCart(product)
            "
            class="absolute bottom-3 right-3 flex items-center justify-center w-10 h-10 rounded-full transition-all active:scale-95 shadow-lg"
            :class="
              isInCart(product.id)
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-purple-600 hover:bg-purple-700'
            "
            :aria-label="
              isInCart(product.id) ? 'Remove from cart' : 'Add to cart'
            "
          >
            <UIcon
              :name="
                isInCart(product.id)
                  ? 'i-iconamoon-trash-bold'
                  : 'i-iconamoon-shopping-bag-bold'
              "
              class="text-white"
              size="20"
            />
          </button>
        </div>
        <div class="grid gap-0.5 pt-3 pb-4 px-1.5 text-sm font-semibold">
          <div v-if="product.image2">คลิกที่รูปเพื่อดูรูปเพิ่มเติม</div>
          <div class="flex flex-col gap-1">
            <p class="text-lg">{{ product.price_normalised }} THB</p>
            <div
              v-if="
                product.originalPrice_normalised &&
                product.price_normalised !== product.originalPrice_normalised
              "
              class="text-[#5f5f5f] dark:text-[#a3a3a3] line-through"
              v-html="`${product.originalPrice_normalised} THB`"
            ></div>
          </div>
          <p>{{ product.name }}</p>
          <p class="text-blue-500">
            {{ product.discount }}
          </p>
          <div class="font-normal text-[#5f5f5f] dark:text-[#a3a3a3]">
            {{ getCategoryName(product?.category) }}
          </div>
          <!-- {{ product.sizes.length >  }} -->
          <div
            v-if="product.name.includes('Ring')"
            class="grid gap-1 grid-cols-4"
          >
            <div
              v-for="(size, idx) in product.sizes"
              :key="idx"
              class="flex-1 text-center p-1 shadow border rounded-lg text-black w dark:text-gray-200 dark:border-gray-200"
            >
              {{ size }}
            </div>
          </div>
        </div>
      </div>
    </NuxtLink>
  </article>
</template>
