<script setup>
defineProps({
  products: Object,
});
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
            :src="product.image2 ?? product.image ?? product.url"
            class="absolute h-full w-full dark:bg-neutral-800 bg-neutral-200 object-cover"
            :class="
              product.shop === 'gnoce' ? 'dark:bg-white' : 'dark:bg-neutral-800'
            "
          />
          <NuxtImg
            :alt="product.name"
            loading="lazy"
            :title="product.name"
            :src="product.image ?? product.url"
            class="absolute h-full w-full dark:bg-neutral-800 bg-neutral-200 object-cover transition-opacity duration-300 group-hover:opacity-0"
            :class="
              product.shop === 'gnoce' ? 'dark:bg-white' : 'dark:bg-neutral-800'
            "
          />
        </div>
        <div class="grid gap-0.5 pt-3 pb-4 px-1.5 text-sm font-semibold">
          <div v-if="product.image2">คลิกที่รูปเพื่อดูรูปเพิ่มเติม</div>
          <div class="flex gap-1">
            <p>{{ product.price }} THB</p>
            <div
              v-if="
                product.priceBefore && product.price !== product.priceBefore
              "
              class="text-[#5f5f5f] dark:text-[#a3a3a3] line-through"
              v-html="`${product.priceBefore} THB`"
            ></div>
          </div>
          <p>{{ product.name }}</p>
          <p class="text-blue-500">
            {{ product.promotion }}
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
