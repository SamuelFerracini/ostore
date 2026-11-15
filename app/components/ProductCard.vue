<script setup>
import cartStore from "~~/stores/cart";

defineProps({
  products: Object,
});

const emit = defineEmits(["wishlist-change"]);

const route = useRoute();
const showDownloadButton = computed(() => route.query.download === "true");
const { open: openModal } = useProductModal();

// product id -> "add" | "remove", while the pulse animation runs
const animatingItems = ref(new Map());
const loadedImages = ref(new Set());

const onImageLoad = (productId) => {
  loadedImages.value.add(productId);
};

const isImageLoaded = (productId) => {
  return loadedImages.value.has(productId);
};

const addToCart = (product) => {
  cartStore.dispatch("addToCart", product);
  triggerAnimation(product.id, "add");
};

const removeFromCart = (productId) => {
  cartStore.dispatch("removeFromCart", productId);
  triggerAnimation(productId, "remove");
};

const isInCart = (productId) => {
  return cartStore.getters.isInCart(productId);
};

const triggerAnimation = (productId, kind) => {
  animatingItems.value.set(productId, kind);
  setTimeout(() => {
    animatingItems.value.delete(productId);
  }, 600);
};

const animationClass = (productId) => {
  const kind = animatingItems.value.get(productId);
  if (!kind) return "";
  return kind === "add" ? "card-pulse--add" : "card-pulse--remove";
};

const downloadImage = (product, event) => {
  event.preventDefault();
  event.stopPropagation();
  // Open image in a new tab
  window.open(product.primaryImage, "_blank");
};

const priceFormat = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});
const formatPrice = (value) => `${priceFormat.format(Math.round(value))} ฿`;

const isRing = (product) =>
  product.categories?.includes("rings") ||
  product.category === "rings" ||
  product.name?.includes("Ring");

const availableSizes = (product) =>
  (product.sizes || []).filter((s) => s.available).length;

// The price we compare against: the Thai shop price when it is higher,
// otherwise the original (pre-sale) price.
const comparePrice = (product) => {
  const price = Number(product.price_normalised);
  const market = Number(product.market_thb);
  if (market && market > price) return { label: "ช็อปไทย", value: market };
  const original = Number(product.originalPrice_normalised);
  if (original && original > price) return { label: "ปกติ", value: original };
  return null;
};

const discountPercent = (product) => {
  const compare = comparePrice(product);
  if (!compare) return 0;
  const price = Number(product.price_normalised);
  return Math.round(((compare.value - price) / compare.value) * 100);
};

const metaLine = (product) => {
  if (isRing(product)) {
    const sizes = availableSizes(product);
    return sizes ? `แหวน · ${sizes} ไซส์` : "แหวน";
  }
  return productTypeLabelTh(product);
};

const onCta = (product) => {
  if (isInCart(product.id)) return removeFromCart(product.id);
  if (isRing(product)) return openModal(product);
  return addToCart(product);
};
</script>

<template>
  <article
    v-for="product in products"
    :key="product.id"
    class="product-card group"
    :class="animationClass(product.id)"
  >
    <div class="arch-frame">
      <div class="arch-photo select-none">
        <button
          type="button"
          class="absolute inset-0 block w-full cursor-pointer"
          :aria-label="`ดูรายละเอียด ${product.name}`"
          @click="openModal(product)"
        >
          <span
            v-if="!isImageLoaded(product.id)"
            class="absolute inset-0 z-10 animate-pulse bg-photo flex items-center justify-center"
          >
            <UIcon name="i-heroicons-photo" class="text-sky" size="32" />
          </span>
          <NuxtImg
            alt=""
            loading="lazy"
            :src="
              product.hoverImage?.length > 0
                ? product.hoverImage
                : product.primaryImage
            "
            class="absolute inset-0 h-full w-full bg-photo object-cover"
          />
          <NuxtImg
            :id="`primary-image-${product.id}`"
            :alt="product.name"
            loading="lazy"
            :src="product.primaryImage"
            @load="onImageLoad(product.id)"
            class="absolute inset-0 h-full w-full bg-photo object-cover transition-opacity duration-300 group-hover:opacity-0"
          />
        </button>

        <!-- Sparkles -->
        <svg
          class="sparkle sparkle--gold"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12 0c.6 6.4 5 11.4 12 12-7 .6-11.4 5-12 12-.6-7-5-11.4-12-12 7-.6 11.4-5.6 12-12Z" />
        </svg>
        <svg
          class="sparkle sparkle--periwinkle"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12 0c.6 6.4 5 11.4 12 12-7 .6-11.4 5-12 12-.6-7-5-11.4-12-12 7-.6 11.4-5.6 12-12Z" />
        </svg>

        <span
          v-if="discountPercent(product) > 0"
          class="absolute bottom-2.5 left-2.5 z-20 rounded-full bg-gold px-2.5 py-1 text-[13px] font-semibold leading-none text-navy"
          >−{{ discountPercent(product) }}%</span
        >

        <div class="absolute bottom-1.5 right-1.5 z-20">
          <ButtonWishlist
            :product="product"
            @change="emit('wishlist-change', product)"
          />
        </div>

        <!-- Download Button -->
        <button
          v-if="showDownloadButton"
          type="button"
          @click.prevent="downloadImage(product, $event)"
          class="absolute top-[22%] right-2 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white text-navy shadow-[0_2px_8px_rgba(29,43,69,0.16)] hover:scale-105 active:scale-95 transition"
          aria-label="ดาวน์โหลดรูปสินค้า"
        >
          <UIcon name="i-iconamoon-download-bold" size="20" />
        </button>
      </div>
    </div>

    <div class="flex flex-1 flex-col px-1 pt-3.5">
      <p
        v-if="product.image2"
        class="mb-1 text-[13px] text-muted dark:text-night-muted"
      >
        คลิกที่รูปเพื่อดูรูปเพิ่มเติม
      </p>
      <h3>
        <button
          type="button"
          class="product-name"
          :title="product.name"
          @click="openModal(product)"
        >
          {{ product.name }}
        </button>
      </h3>
      <div class="price-row">
        <span class="text-[18px] font-semibold text-royal dark:text-night-price"
          >{{ formatPrice(product.price_normalised) }}</span
        >
        <span
          v-if="comparePrice(product)"
          class="text-[13px] text-muted dark:text-night-muted"
        >
          {{ comparePrice(product).label }}
          <s>{{ formatPrice(comparePrice(product).value) }}</s>
        </span>
      </div>
      <p class="mt-1 text-[13px] text-gold-text dark:text-night-gold">
        {{ metaLine(product) }}
      </p>

      <div class="mt-auto pt-3.5">
        <button
          v-if="isInCart(product.id)"
          type="button"
          class="card-cta card-cta--in-cart"
          aria-label="ในตะกร้าแล้ว แตะเพื่อเอาออก"
          @click="onCta(product)"
        >
          <UIcon name="i-iconamoon-check-bold" size="18" aria-hidden="true" />
          ในตะกร้าแล้ว
        </button>
        <button
          v-else-if="isRing(product)"
          type="button"
          class="card-cta card-cta--size"
          @click="onCta(product)"
        >
          เลือกไซส์
        </button>
        <button
          v-else
          type="button"
          class="card-cta card-cta--add"
          @click="onCta(product)"
        >
          <UIcon
            name="i-iconamoon-shopping-bag-bold"
            size="18"
            aria-hidden="true"
          />
          ใส่ตะกร้า
        </button>
      </div>
    </div>
  </article>
</template>

<style lang="postcss" scoped>
.product-card {
  @apply flex h-full min-w-0 flex-col rounded-[22px];
}

.arch-frame {
  @apply bg-white border border-gold-arch dark:bg-midnight-surface dark:border-gold/35;
  padding: 6px;
  border-radius: 50% 50% 18px 18px / 26% 26% 18px 18px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.group:hover .arch-frame {
  @apply border-gold;
  box-shadow: 0 10px 28px rgba(29, 43, 69, 0.1);
}

.arch-photo {
  @apply relative overflow-hidden bg-photo;
  aspect-ratio: 3 / 4;
  border-radius: 50% 50% 14px 14px / 25% 25% 14px 14px;
}

.sparkle {
  @apply pointer-events-none absolute z-20 opacity-0;
  transform: scale(0.6) rotate(-20deg);
  transition: opacity 0.35s ease, transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.sparkle--gold {
  @apply fill-gold;
  top: 16%;
  left: 15%;
  width: 18px;
  height: 18px;
}
.sparkle--periwinkle {
  @apply fill-periwinkle;
  top: 27%;
  right: 17%;
  width: 12px;
  height: 12px;
  transition-delay: 0.08s;
}
.group:hover .sparkle,
.group:focus-within .sparkle {
  @apply opacity-100;
  transform: scale(1) rotate(0deg);
}

.product-name {
  @apply block w-full text-left font-display font-semibold text-navy line-clamp-2 dark:text-night-text;
  font-size: 18px;
  line-height: 1.2;
  min-height: 2.4em;
}
@media (min-width: 640px) {
  .product-name {
    font-size: 21px;
  }
}
.product-name:hover {
  @apply text-royal dark:text-night-price;
}

.price-row {
  @apply mt-1.5 flex flex-col;
  min-height: 2.9rem;
}
@media (min-width: 640px) {
  .price-row {
    @apply flex-row flex-wrap items-baseline gap-x-2;
    min-height: 1.75rem;
  }
}

.card-cta {
  @apply flex w-full items-center justify-center gap-2 rounded-full text-[15px] font-semibold transition active:scale-[0.97];
  height: 46px;
}
.card-cta--add {
  @apply bg-gold text-navy hover:bg-gold-light;
}
.card-cta--size {
  @apply border-[1.5px] border-navy bg-transparent text-navy hover:bg-navy hover:text-white dark:border-night-text dark:text-night-text dark:hover:bg-night-text dark:hover:text-midnight;
}
.card-cta--in-cart {
  @apply bg-royal text-white hover:bg-royal-blue-600 dark:ring-1 dark:ring-periwinkle/60;
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

@keyframes glowGold {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(197, 162, 83, 0);
  }
  50% {
    box-shadow: 0 0 22px 4px rgba(197, 162, 83, 0.45);
  }
}

@keyframes glowRoyal {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(43, 76, 126, 0);
  }
  50% {
    box-shadow: 0 0 22px 4px rgba(43, 76, 126, 0.35);
  }
}

.card-pulse--add {
  animation:
    productCardPulse 0.6s cubic-bezier(0.4, 0, 0.2, 1),
    glowGold 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}
.card-pulse--remove {
  animation:
    productCardPulse 0.6s cubic-bezier(0.4, 0, 0.2, 1),
    glowRoyal 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
