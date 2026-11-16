<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination, Thumbs } from 'swiper/modules';
const { isOpenImageSliderModal } = useComponents();
const { t } = useLocale();

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const thumbsSwiper = ref(null);
const setThumbsSwiper = swiper => {
  thumbsSwiper.value = swiper;
};

const modules = [Navigation, Pagination, Thumbs];

const route = useRoute();
const id = computed(() => route.params.id);
const parts = id.value.split('-');
const sku = parts.pop();
const slug = parts.join('-');

const productResult = ref({});
const selectedVariation = ref(null);

onMounted(() => getProduct(slug, sku).then(data => (productResult.value = data.product)));

const product = computed(() => productResult.value);

const sizeOrder = ['xxs', 'xs', 's', 'm', 'l', 'xl', '2xl', '23-24', '25', '26-27', '28-29', '30', '31-32', '33', '34-25'];

const sortedVariations = computed(() => {
  if (!product.value.variations?.nodes) return [];
  return product.value.variations.nodes.slice().sort((a, b) => {
    const aSize = a.attributes.nodes[0].value.toLowerCase();
    const bSize = b.attributes.nodes[0].value.toLowerCase();
    return sizeOrder.indexOf(aSize) - sizeOrder.indexOf(bSize);
  });
});

watchEffect(() => {
  if (sortedVariations.value.length > 0) {
    const variationInStock = sortedVariations.value.find(variation => variation.stockStatus === 'IN_STOCK');
    selectedVariation.value = variationInStock ? variationInStock : null;
  }
});

const calculateDiscountPercentage = computed(() => {
  if (!product.value.salePrice || !product.value.regularPrice) return 0;
  const salePriceValue = parseFloat(product.value.salePrice.replace(/[^0-9]/g, ''));
  const regularPriceValue = parseFloat(product.value.regularPrice.replace(/[^0-9]/g, ''));
  return Math.round(((salePriceValue - regularPriceValue) / regularPriceValue) * 100);
});

const { handleAddToCart, addToCartButtonStatus } = useCart();
</script>

<template>
  <ProductSkeleton v-if="!product.name" />
  <div v-else class="justify-center flex flex-col lg:flex-row lg:mx-5">
    <ButtonBack />
    <div class="mr-6 mt-5 pt-2.5 max-xl:hidden">
      <swiper :modules="modules" @swiper="setThumbsSwiper" class="product-images-thumbs w-14">
        <swiper-slide class="cursor-pointer rounded-xl overflow-hidden border-2 border-white dark:border-midnight">
          <NuxtImg
            :alt="product.name"
            class="h-full w-full border-2 border-white bg-photo dark:border-midnight rounded-[10px]"
            :src="product.image?.sourceUrl" />
        </swiper-slide>
        <swiper-slide class="cursor-pointer rounded-xl overflow-hidden border-2 border-white dark:border-midnight" v-for="(node, i) in product.galleryImages?.nodes" :key="i">
          <NuxtImg :alt="product.name" class="h-full w-full border-2 border-white bg-photo dark:border-midnight rounded-[10px]" :src="node.sourceUrl" />
        </swiper-slide>
      </swiper>
    </div>
    <div
      class="flex lg:p-5 lg:gap-5 flex-col lg:flex-row lg:border lg:border-gold-line lg:bg-white lg:dark:bg-midnight-surface lg:dark:border-midnight-line lg:rounded-[32px] lg:mt-2.5 select-none">
      <div class="relative">
        <swiper
          :style="{
            '--swiper-navigation-size': '16px',
            '--swiper-navigation-color': '#1D2B45',
            '--swiper-pagination-color': '#2B4C7E',
          }"
          :spaceBetween="4"
          :slidesPerView="1.5"
          :pagination="{
            dynamicBullets: true,
          }"
          :navigation="true"
          :modules="modules"
          :thumbs="{ swiper: thumbsSwiper }"
          class="lg:w-[530px] lg:h-[530px] xl:w-[600px] xl:h-[600px] lg:rounded-2xl">
          <swiper-slide @click="isOpenImageSliderModal = true">
            <NuxtImg :alt="product.name" class="h-full w-full bg-photo" :src="product.image?.sourceUrl" />
          </swiper-slide>
          <swiper-slide @click="isOpenImageSliderModal = true" v-for="(node, i) in product.galleryImages?.nodes" :key="i">
            <NuxtImg :alt="product.name" class="h-full w-full bg-photo" :src="node.sourceUrl" />
          </swiper-slide>
        </swiper>
      </div>
      <ImageSliderWithModal :product="product" v-model="isOpenImageSliderModal" />
      <div class="w-full lg:max-w-[28rem]">
        <div class="flex-col flex gap-4 lg:max-h-[530px] xl:max-h-[600px] overflow-hidden">
          <div class="p-3 lg:pb-4 lg:p-0 border-b border-gold-line dark:border-midnight-line">
            <h1 class="font-display text-3xl font-semibold mb-1 text-navy dark:text-night-text">{{ product.name }}</h1>
            <div class="flex justify-between flex-row items-baseline">
              <div class="flex flex-row items-baseline">
                <p class="text-xl font-semibold text-royal dark:text-night-price" v-html="product.salePrice"></p>
                <p class="text-sm ml-2 text-muted dark:text-night-muted">{{ t("product.vat") }}</p>
              </div>
            </div>
            <div class="flex-wrap items-baseline flex-row flex">
              <p class="text-sm text-muted dark:text-night-muted">{{ t("product.regular") }}</p>
              <p class="text-sm ml-1 line-through text-muted dark:text-night-muted" v-html="product.regularPrice"></p>
              <p class="text-sm ml-1 font-semibold text-gold-text dark:text-night-gold">{{ calculateDiscountPercentage }}%</p>
            </div>
          </div>

          <div class="flex gap-2 px-3 lg:px-0" v-for="(variation, i) in product.productTypes?.nodes" :key="i">
            <div v-for="(vars, i) in variation.products.nodes" :key="i">
              <NuxtLink
                :to="`/product/${vars.slug}-${product.sku.split('-')[0]}`"
                :class="[
                  'flex w-12 rounded-lg border-2 select-varitaion transition-all duration-200 bg-photo',
                  vars.allPaColor.nodes[0].name === product.allPaColor.nodes[0].name ? 'selected-varitaion' : 'border-sky dark:border-midnight-line',
                ]">
                <NuxtImg
                  :alt="vars.allPaColor.nodes[0].name"
                  :src="vars.image.sourceUrl"
                  :title="vars.allPaColor.nodes[0].name"
                  class="rounded-md border-2 border-white dark:border-midnight" />
              </NuxtLink>
            </div>
          </div>

          <div class="pb-4 px-3 lg:px-0 border-b border-gold-line dark:border-midnight-line">
            <div class="text-sm font-semibold leading-5 text-muted dark:text-night-muted flex gap-1">
              {{ t("product.sizeLabel") }}
              <div class="uppercase">{{ selectedVariation.attributes.nodes.map(attr => attr.value).toString() }}</div>
            </div>
            <div class="flex gap-2 mt-2 mb-4 flex-wrap">
              <label
                class="min-h-[44px] min-w-[44px] inline-flex items-center justify-center px-3 rounded-full cursor-pointer select-varitaion border border-sky dark:border-midnight-line transition-all duration-200"
                v-for="variation in sortedVariations"
                :key="variation.databaseId"
                :class="[variation.stockStatus === 'OUT_OF_STOCK' ? 'disabled' : '', selectedVariation.databaseId === variation.databaseId ? 'selected-varitaion' : '']">
                <input type="radio" class="hidden" name="variation" :value="variation" :disabled="variation.stockStatus === 'OUT_OF_STOCK'" v-model="selectedVariation" />
                <span class="font-semibold uppercase" :title="t('order.size', { size: variation.attributes.nodes.map(attr => attr.value).toString() })">
                  {{ variation.attributes.nodes.map(attr => attr.value).toString() }}
                </span>
              </label>
            </div>

            <div class="flex">
              <button
                @click="handleAddToCart(selectedVariation.databaseId)"
                :disabled="addToCartButtonStatus !== 'add'"
                class="button-bezel w-full h-[46px] rounded-full relative font-semibold text-navy text-[15px] flex justify-center items-center">
                <Transition name="slide-up">
                  <div v-if="addToCartButtonStatus === 'add'" class="absolute">{{ t("product.addToCart") }}</div>
                  <UIcon v-else-if="addToCartButtonStatus === 'loading'" class="absolute" name="i-svg-spinners-90-ring-with-bg" size="22" />
                  <div v-else-if="addToCartButtonStatus === 'added'" class="absolute">{{ t("product.added") }}</div>
                </Transition>
              </button>
              <div class="ml-3"><ButtonWishlist :product="product" /></div>
            </div>
          </div>
          <div class="px-3 lg:px-0">
            <div class="font-display-th text-lg mb-2 font-semibold">{{ t("product.info") }}</div>
            <div class="description leading-7 text-sm">
              <ul>
                <li>
                  Free returns within 15 days. Click for detailed
                  <a class="underline" href="#">information</a>
                </li>
                <li>{{ t("product.sku", { sku: product.sku }) }}</li>
                <div v-html="product.description"></div>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <h2 class="font-display-th text-xl lg:text-2xl lg:text-center font-semibold mt-8 pt-4 px-3 border-t border-gold-line dark:border-midnight-line lg:border-none">{{ t("product.similar") }}</h2>
  <div class="grid grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-x-3 gap-y-7 sm:gap-x-6 sm:gap-y-10 px-4 lg:px-8 mt-4 lg:mt-6">
    <ProductCard :products="product.related?.nodes" />
    <ProductsSkeleton v-if="!product.name" />
  </div>
</template>

<style lang="postcss">
.product-images-thumbs .swiper-wrapper {
  @apply flex-col gap-3;
}
.product-images-thumbs .swiper-slide-thumb-active {
  @apply border-royal dark:border-night-price;
}
.swiper-button-next,
.swiper-button-prev {
  @apply bg-white/80 hover:bg-white p-6 rounded-full flex items-center justify-center border border-gold-line transition backdrop-blur-sm;
}

.swiper-button-prev.swiper-button-disabled,
.swiper-button-next.swiper-button-disabled {
  @apply hidden;
}

.swiper-pagination {
  @apply bg-white/50 shadow-sm rounded-full py-1 backdrop-blur-sm;
}

.selected-varitaion,
.select-varitaion:hover:not(.disabled) {
  @apply border-royal dark:border-night-price text-royal dark:text-night-price bg-mist dark:bg-midnight;
}

.disabled {
  @apply opacity-40 cursor-default;
}

.button-bezel {
  box-shadow: 0 0 0 var(--button-outline, 0px) rgba(197, 162, 83, 0.35);
  @apply bg-gold transition scale-[var(--button-scale,1)] duration-200;
  &:hover {
    @apply bg-gold-light;
  }
  &:active {
    --button-outline: 4px;
    --button-scale: 0.975;
  }
}

.description ul li {
  background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxlbGxpcHNlIHJ5PSIzIiByeD0iMyIgY3k9IjMiIGN4PSIzIiBmaWxsPSIjYzljOWM5Ii8+PC9zdmc+)
    no-repeat 0 0.7rem;
  padding-left: 0.938rem;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease 0s, opacity 0.3s ease 0s;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(-30px) scale(0);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(30px) scale(0);
}
</style>
