<script setup>
defineProps({
  products: Object,
});
</script>

<template>
  <article v-for="product in products">
    <NuxtLink class="group select-none">
      <div class="transition ease-[ease] duration-300">
        <div
          class="relative pb-[133%] dark:shadow-[0_8px_24px_rgba(0,0,0,.5)] rounded-2xl overflow-hidden"
        >
          <NuxtImg
            :alt="product.name"
            loading="lazy"
            :title="product.name"
            :src="product.url"
            :class="
              product.shop === 'gnoce' ? 'dark:bg-white' : 'dark:bg-neutral-800'
            "
            class="absolute h-full w-full bg-neutral-200 object-cover transition-opacity duration-300 group-hover:opacity-50"
          />
        </div>
        <div class="grid gap-0.5 pt-3 pb-4 px-1.5 text-sm font-semibold">
          <div class="flex gap-1">
            <p>{{ product.price }} THB</p>
            <!-- <div
              class="text-[#5f5f5f] dark:text-[#a3a3a3] line-through"
              v-html="product.price"
            ></div> -->
          </div>
          <div>{{ product.name }}</div>
          <p class="text-blue-500">{{ product.promotion }}</p>
          <div class="font-normal text-[#5f5f5f] dark:text-[#a3a3a3]">
            {{ getCategoryName(product?.category) }}
          </div>
        </div>
      </div>
    </NuxtLink>
  </article>
</template>
