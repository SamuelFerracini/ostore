<script setup lang="ts">
import cartStore from "~~/stores/cart";

const { siteName } = useAppConfig();
const runtimeConfig = useRuntimeConfig();

function readPromotionsPaused(value: unknown): boolean {
  if (value === true) return true;
  if (typeof value === "string") return value.toLowerCase() === "true";
  return false;
}

const promotionsPaused = computed(() =>
  readPromotionsPaused(runtimeConfig.public.promotionsPaused),
);

useHead({
  htmlAttrs: {
    lang: "th",
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
  if (promotionsPaused.value) return;
  window.addEventListener("scroll", handleScroll);
  // Validate cart items against products.json
  cartStore.dispatch("loadCart");
});

onBeforeUnmount(() => {
  if (promotionsPaused.value) return;
  window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <PromotionsPaused v-if="promotionsPaused" />
  <template v-else>
    <AppHeader />
    <main class="pb-[96px] lg:pb-0 min-h-[calc(100vh-220px)]">
      <NuxtPage />
    </main>
    <AppFooter />

    <!-- Scroll to top button -->
    <Transition name="scroll-button">
      <button
        v-if="showScrollToTop"
        @click="scrollToTop"
        class="fixed bottom-24 lg:bottom-8 right-4 lg:right-6 z-50 flex items-center justify-center w-12 h-12 rounded-full bg-white dark:bg-midnight-surface border border-gold-line dark:border-midnight-line shadow-[0_6px_18px_rgba(29,43,69,0.14)] hover:border-gold transition-all active:scale-95"
        aria-label="กลับขึ้นด้านบน"
      >
        <UIcon
          name="i-iconamoon-arrow-up-2-bold"
          class="text-navy dark:text-night-gold"
          size="24"
        />
      </button>
    </Transition>
  </template>
</template>

<style lang="postcss">
body {
  @apply bg-ivory text-navy font-sans antialiased dark:bg-midnight dark:text-night-text;
}

.dark {
  color-scheme: dark;
}

:focus-visible {
  outline: 3px solid theme("colors.periwinkle");
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
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
