<script setup>
// Admin only: floating bar with the poster pick count, shown on store pages.
const route = useRoute();
const { t } = useLocale();
const { isAdmin } = useAdmin();
const { count, clear } = usePosterSelection();

const visible = computed(
  () => isAdmin.value && count.value > 0 && route.path !== "/admin/poster",
);
</script>

<template>
  <Transition name="poster-bar">
    <div v-if="visible" class="poster-bar" role="region" :aria-label="t('poster.barAria')">
      <span class="poster-bar__count">
        <UIcon name="i-heroicons-photo" size="18" aria-hidden="true" />
        {{ t("poster.count", { n: count }) }}
      </span>
      <button type="button" class="poster-bar__clear" @click="clear">
        {{ t("poster.clear") }}
      </button>
      <NuxtLink to="/admin/poster" class="poster-bar__open">
        {{ t("poster.open") }}
      </NuxtLink>
    </div>
  </Transition>
</template>

<style lang="postcss" scoped>
.poster-bar {
  @apply fixed z-50 flex items-center gap-1 rounded-full bg-navy p-1.5 pl-4 text-white shadow-[0_10px_30px_rgba(29,43,69,0.3)] dark:bg-midnight-surface dark:ring-1 dark:ring-midnight-line;
  /* Mobile: above the bottom nav, clear of the scroll-to-top button. */
  left: 1rem;
  bottom: calc(76px + env(safe-area-inset-bottom));
}
@media (min-width: 1024px) {
  .poster-bar {
    left: 50%;
    bottom: 1.5rem;
    transform: translateX(-50%);
  }
}
.poster-bar__count {
  @apply mr-1 inline-flex items-center gap-1.5 whitespace-nowrap text-[15px] font-semibold text-gold-light;
}
.poster-bar__clear {
  @apply min-h-[40px] rounded-full px-3 text-[14px] text-white/80 transition hover:bg-white/10 hover:text-white;
}
.poster-bar__open {
  @apply inline-flex min-h-[40px] items-center whitespace-nowrap rounded-full bg-gold px-4 text-[14px] font-semibold text-navy transition hover:bg-gold-light active:scale-95;
}

.poster-bar-enter-active,
.poster-bar-leave-active {
  @apply transition duration-200 ease-out;
}
.poster-bar-enter-from,
.poster-bar-leave-to {
  @apply opacity-0;
  translate: 0 12px;
}
</style>
