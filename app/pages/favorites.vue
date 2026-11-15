<script setup>
const { wishlist } = useWishlist();

// Only items saved from the product list (products.json shape).
const items = computed(() =>
  wishlist.value.filter((item) => item && item.primaryImage)
);
</script>

<template>
  <div class="mx-auto max-w-[1440px] px-4 lg:px-8">
    <div class="pt-6 pb-5 lg:pt-9 lg:pb-7">
      <h1
        class="font-display-th text-[26px] lg:text-[34px] font-semibold leading-tight text-navy dark:text-night-text"
      >
        รายการโปรด
      </h1>
      <p v-if="items.length" class="mt-1 text-[15px] text-muted dark:text-night-muted">
        {{ items.length }} ชิ้น
      </p>
    </div>

    <div v-if="items.length" class="favorites-grid pb-10">
      <ProductCard :products="items" />
    </div>
    <div
      v-else
      class="flex min-h-[50vh] flex-col items-center justify-center px-5 pb-16 text-center"
    >
      <div
        class="flex h-24 w-24 items-center justify-center rounded-full border border-gold-line bg-gold-soft dark:border-gold/30 dark:bg-gold/10"
      >
        <UIcon
          name="i-iconamoon-heart"
          class="h-12 w-12 text-gold-text dark:text-night-gold"
        />
      </div>
      <p
        class="mt-6 font-display-th text-2xl font-semibold text-navy dark:text-night-text"
      >
        ยังไม่มีรายการโปรด
      </p>
      <p class="mt-2 text-[15px] text-muted dark:text-night-muted">
        กดหัวใจที่รูปสินค้าเพื่อเก็บไว้ดูทีหลัง
      </p>
      <NuxtLink
        to="/products"
        class="mt-6 inline-flex min-h-[46px] items-center rounded-full bg-gold px-6 text-[15px] font-semibold text-navy hover:bg-gold-light transition"
      >
        เลือกซื้อสินค้า
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.favorites-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 28px 12px;
}

@media (min-width: 640px) {
  .favorites-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 40px 24px;
  }
}
</style>
