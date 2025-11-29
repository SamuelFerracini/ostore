<script setup lang="ts">
const { siteName } = useAppConfig();

useHead({
  htmlAttrs: {
    lang: "en",
  },
  title: siteName,
  meta: [
    {
      name: "viewport",
      content:
        "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover",
    },
  ],
});

const showScrollToTop = ref(false);

const handleScroll = () => {
  showScrollToTop.value = window.scrollY > 300;
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <AppHeader />
  <div class="pt-[80px] lg:pt-20 min-h-[calc(100vh-72px)]">
    <NuxtPage />
  </div>
  <AppFooter />

  <!-- Scroll to top button -->
  <Transition name="scroll-button">
    <button
      v-if="showScrollToTop"
      @click="scrollToTop"
      class="fixed bottom-20 right-6 z-50 flex items-center justify-center w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-white/85 dark:bg-black/85 backdrop-blur-sm dark:backdrop-blur-lg shadow-lg hover:bg-white/95 hover:dark:bg-black/95 transition-all active:scale-95 border border-black/5 dark:border-white/10"
      aria-label="Scroll to top"
    >
      <UIcon
        name="i-iconamoon-arrow-up-2-bold"
        class="text-[#5f5f5f] dark:text-[#b7b7b7]"
        size="24"
      />
    </button>
  </Transition>
</template>

<style lang="postcss">
.dark {
  @apply bg-black text-neutral-100;
  color-scheme: dark;
}
.dropdown-enter-active {
  @apply transition duration-200 ease-out;
}
.dropdown-enter-from,
.dropdown-leave-to {
  @apply translate-y-5 opacity-0;
}
.dropdown-enter-to,
.dropdown-leave-from {
  @apply transform opacity-100;
}
.dropdown-leave-active {
  @apply transition duration-150 ease-in;
}

/* Scroll to top button transitions */
.scroll-button-enter-active {
  @apply transition duration-200 ease-out;
}
.scroll-button-leave-active {
  @apply transition duration-150 ease-in;
}
.scroll-button-enter-from,
.scroll-button-leave-to {
  @apply translate-y-5 opacity-0 scale-90;
}
.scroll-button-enter-to,
.scroll-button-leave-from {
  @apply translate-y-0 opacity-100 scale-100;
}
</style>
