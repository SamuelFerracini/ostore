<script setup>
const categoriesData = ref([]);

onMounted(async () => {
  const response = await listCategories();
  categoriesData.value = response;
});

const categories = computed(() => categoriesData.value);
</script>

<template>
  <div
    class="slider-container ml-2 lg:ml-4 gap-2 lg:gap-4"
    v-if="!categories.length"
  >
    <div
      class="h-[36px] min-w-36 bg-neutral-200 dark:bg-neutral-800 rounded-full skeleton"
    ></div>

    <div
      class="h-[36px] relative min-w-32 bg-neutral-200 dark:bg-neutral-800 rounded-full skeleton items-center flex"
    ></div>
    <div
      class="h-[36px] relative min-w-48 bg-neutral-200 dark:bg-neutral-800 rounded-full skeleton items-center flex"
    ></div>
    <div
      class="h-[36px] relative min-w-32 bg-neutral-200 dark:bg-neutral-800 rounded-full skeleton items-center flex"
    ></div>
    <div
      class="h-[36px] relative min-w-60 bg-neutral-200 dark:bg-neutral-800 rounded-full skeleton items-center flex"
    ></div>
    <div
      class="h-[36px] relative min-w-32 bg-neutral-200 dark:bg-neutral-800 rounded-full skeleton items-center flex"
    ></div>
    <div
      class="h-[36px] relative min-w-36 bg-neutral-200 dark:bg-neutral-800 rounded-full skeleton items-center flex"
    ></div>
    <div
      class="h-[36px] relative min-w-32 bg-neutral-200 dark:bg-neutral-800 rounded-full skeleton items-center flex"
    ></div>
  </div>
  <CarouselCategories v-else :categories="categories" />
</template>
