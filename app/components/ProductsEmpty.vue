<script setup>
const route = useRoute();
const router = useRouter();

const resetSearch = () => {
  router.push({ query: { ...route.query, q: undefined } });
};

const checkAllTabs = () => {
  router.push({ query: { ...route.query, category: undefined } });
}
</script>

<template>
  <div
    class="flex min-h-[50vh] w-full flex-col items-center justify-center px-5 pb-16 text-center"
  >
    <div
      class="flex h-24 w-24 items-center justify-center rounded-full border border-sky bg-mist dark:border-midnight-line dark:bg-midnight-surface"
    >
      <UIcon
        name="i-iconamoon-search-bold"
        class="h-11 w-11 text-royal dark:text-night-price"
      />
    </div>
    <p
      v-if="route.query.category && route.query.q"
      class="mt-6 font-display-th text-2xl font-semibold text-navy dark:text-night-text"
    >
      ไม่พบ “{{ route.query.q }}” ใน{{ categoryLabelTh(route.query.category) }}
    </p>
    <p
      v-else-if="route.query.q"
      class="mt-6 font-display-th text-2xl font-semibold text-navy dark:text-night-text"
    >
      ไม่พบสินค้าที่ตรงกับ “{{ route.query.q }}”
    </p>
    <p
      v-else
      class="mt-6 font-display-th text-2xl font-semibold text-navy dark:text-night-text"
    >
      ยังไม่มีสินค้าในหมวดนี้
    </p>
    <p class="mt-2 text-[15px] text-muted dark:text-night-muted">
      ลองค้นหาด้วยคำอื่น หรือดูสินค้าทุกหมวด
    </p>
    <div class="mt-6 flex flex-wrap items-center justify-center gap-2">
      <button
        v-if="route.query.q"
        type="button"
        @click="resetSearch"
        class="min-h-[46px] rounded-full border border-sky bg-white px-5 text-[15px] font-medium text-navy hover:border-periwinkle transition active:scale-95 dark:border-midnight-line dark:bg-midnight-surface dark:text-night-text"
      >
        ล้างคำค้นหา
      </button>
      <button
        v-if="route.query.category"
        type="button"
        @click="checkAllTabs"
        class="min-h-[46px] rounded-full bg-navy px-5 text-[15px] font-medium text-white hover:bg-royal transition active:scale-95 dark:bg-night-text dark:text-midnight"
      >
        ดูทุกหมวด
      </button>
    </div>
  </div>
</template>
