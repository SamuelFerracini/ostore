<script setup>
const { wishlist } = useWishlist();
</script>

<template>
  <div class="max-w-screen-2xl m-auto p-3 lg:p-5">
    <template v-if="wishlist.length">
      <div class="flex items-baseline gap-3 px-1 lg:mt-6">
        <h1 class="font-display-th text-3xl font-semibold text-navy dark:text-night-text">รายการโปรด</h1>
        <span class="text-sm text-muted">{{ wishlist.length }} ชิ้น</span>
      </div>
      <div class="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7 gap-3 lg:gap-5 mt-4 lg:mt-6">
        <ProductCard :products="wishlist" />
      </div>
    </template>
    <div v-else class="flex flex-col items-center justify-center text-center px-5 min-h-[60vh]">
      <UIcon name="i-iconamoon-heart" class="w-14 h-14 text-gold-line" />
      <h1 class="font-display-th text-2xl font-semibold text-navy dark:text-night-text mt-4">ยังไม่มีรายการโปรด</h1>
      <NuxtLink
        to="/products"
        class="mt-6 inline-flex items-center rounded-full bg-gold px-6 py-2.5 text-sm font-medium text-navy hover:bg-gold-light transition active:scale-95">
        เลือกซื้อสินค้า
      </NuxtLink>
    </div>
  </div>
</template>
