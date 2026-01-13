<script setup>
import cartStore from "~~/stores/cart";

defineProps({
  products: Object,
});

const route = useRoute();
const showDownloadButton = computed(() => route.query.download === "true");

const animatingItems = ref(new Set());
const loadedImages = ref(new Set());

const onImageLoad = (productId) => {
  loadedImages.value.add(productId);
};

const isImageLoaded = (productId) => {
  return loadedImages.value.has(productId);
};

const addToCart = (product) => {
  cartStore.dispatch("addToCart", product);
  triggerAnimation(product.id);
};

const removeFromCart = (productId) => {
  cartStore.dispatch("removeFromCart", productId);
  triggerAnimation(productId);
};

const isInCart = (productId) => {
  return cartStore.getters.isInCart(productId);
};

const triggerAnimation = (productId) => {
  animatingItems.value.add(productId);
  setTimeout(() => {
    animatingItems.value.delete(productId);
  }, 600);
};

const isAnimating = (productId) => {
  return animatingItems.value.has(productId);
};

const downloadImage = (product, event) => {
  event.preventDefault();
  event.stopPropagation();
  // Open image in a new tab
  window.open(product.primaryImage, "_blank");
};
</script>

<template>
  <article v-for="product in products">
    <NuxtLink>
      <div
        class="transition-all ease-[ease] duration-300"
        :class="isAnimating(product.id) ? 'product-card-animate' : ''"
      >
        <div
          class="relative pb-[133%] dark:shadow-[0_8px_24px_rgba(0,0,0,.5)] rounded-2xl overflow-hidden group select-none"
        >
          <div
            v-if="!isImageLoaded(product.id)"
            class="absolute inset-0 z-10 animate-pulse bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
          >
            <UIcon
              name="i-heroicons-photo"
              class="text-gray-400 dark:text-gray-600"
              size="32"
            />
          </div>

          <NuxtImg
            :alt="product.name"
            loading="lazy"
            :title="product.name"
            :src="
              product.hoverImage?.length > 0
                ? product.hoverImage
                : product.primaryImage
            "
            class="absolute h-full w-full dark:bg-neutral-800 bg-neutral-200 object-cover"
            :class="
              product.shop === 'gnoce' ? 'dark:bg-white' : 'dark:bg-neutral-800'
            "
          />
          <NuxtImg
            :id="`primary-image-${product.id}`"
            :alt="product.name"
            loading="lazy"
            :title="product.name"
            :src="product.primaryImage"
            @load="onImageLoad(product.id)"
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
            class="absolute bottom-3 left-3 flex items-center justify-center w-10 h-10 rounded-full transition-all active:scale-95 shadow-lg bg-blue-600 hover:bg-blue-700 z-20"
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
            class="absolute bottom-3 right-3 flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 shadow-lg z-20"
            :class="[
              isInCart(product.id)
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-purple-600 hover:bg-purple-700',
              isAnimating(product.id)
                ? 'cart-button-animate'
                : 'hover:scale-110 active:scale-95',
            ]"
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
              class="text-white transition-transform duration-200"
              :class="isAnimating(product.id) ? 'scale-110' : ''"
              size="20"
            />
          </button>

          <!-- Download Button -->
          <button
            v-if="showDownloadButton"
            @click.prevent="downloadImage(product, $event)"
            class="absolute top-3 right-3 flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 shadow-lg bg-green-600 hover:bg-green-700 hover:scale-110 active:scale-95 z-20"
            aria-label="Download product image"
          >
            <UIcon
              name="i-iconamoon-download-bold"
              class="text-white"
              size="20"
            />
          </button>
        </div>
        <div class="grid gap-0.5 pt-3 pb-4 px-1.5 text-sm font-semibold">
          <div v-if="product.image2">คลิกที่รูปเพื่อดูรูปเพิ่มเติม</div>
          <div class="flex flex-col gap-1">
            <p class="text-lg text-black dark:text-white">
              {{ Math.round(product.price_normalised) }} THB
            </p>
            <div
              v-if="
                product.originalPrice_normalised &&
                product.price_normalised !== product.originalPrice_normalised
              "
              class="text-[#5f5f5f] dark:text-[#a3a3a3] line-through"
              v-html="`${Math.round(product.originalPrice_normalised)} THB`"
            ></div>
          </div>
          <p class="text-black dark:text-white">{{ product.name }}</p>
          <p class="text-blue-600 dark:text-blue-500">
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
              v-for="(size, idx) in product.sizes.filter(s => s.available)"
              :key="idx"
              class="flex-1 text-center p-1 shadow border rounded-lg text-black w dark:text-gray-200 dark:border-gray-200"
            >
              {{ size.value }}
            </div>
          </div>
        </div>
      </div>
    </NuxtLink>
  </article>
</template>

<style scoped>
@keyframes cartButtonPulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
    box-shadow: 0 0 0 8px rgba(147, 51, 234, 0.3);
  }
  100% {
    transform: scale(1);
  }
}

.cart-button-animate {
  animation: cartButtonPulse 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes productCardPulse {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(0.98);
  }
  50% {
    transform: scale(1.02);
  }
  75% {
    transform: scale(0.99);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes glowPulse {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(147, 51, 234, 0);
  }
  50% {
    box-shadow: 0 0 20px 4px rgba(147, 51, 234, 0.4);
  }
}

.product-card-animate {
  animation: productCardPulse 0.6s cubic-bezier(0.4, 0, 0.2, 1),
    glowPulse 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
