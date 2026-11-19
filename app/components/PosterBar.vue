<script setup>
// Admin only: floating bar with the poster pick count, shown on store pages.
const route = useRoute();
const { t } = useLocale();
const { isAdmin } = useAdmin();
const { items, count, clear, remove } = usePosterSelection();

const open = ref(false);
const root = ref(null);
const panelId = "poster-bar-panel";

const visible = computed(
  () => isAdmin.value && count.value > 0 && route.path !== "/admin/poster",
);

// Close on Escape, outside press, navigation, or when the bar hides.
const onKey = (e) => {
  if (e.key === "Escape") open.value = false;
};
const onPress = (e) => {
  if (open.value && root.value && !root.value.contains(e.target)) open.value = false;
};
onMounted(() => {
  document.addEventListener("keydown", onKey);
  document.addEventListener("pointerdown", onPress);
});
onBeforeUnmount(() => {
  document.removeEventListener("keydown", onKey);
  document.removeEventListener("pointerdown", onPress);
});
watch(() => route.fullPath, () => (open.value = false));
watch(visible, (v) => {
  if (!v) open.value = false;
});
</script>

<template>
  <Transition name="poster-bar">
    <div
      v-if="visible"
      ref="root"
      class="poster-bar"
      role="region"
      :aria-label="t('poster.barAria')"
    >
      <div v-if="open" :id="panelId" class="poster-panel" role="group" :aria-label="t('poster.panelAria')">
        <ol class="poster-panel__list">
          <li v-for="(item, i) in items" :key="item.id" class="poster-panel__row">
            <span class="poster-panel__n">{{ i + 1 }}</span>
            <img
              v-if="item.primaryImage"
              :src="item.primaryImage"
              alt=""
              loading="lazy"
              class="poster-panel__thumb"
            />
            <span v-else class="poster-panel__thumb" aria-hidden="true" />
            <span class="poster-panel__text">
              <span class="poster-panel__name">{{ item.name }}</span>
              <span class="poster-panel__price">{{ posterLabel(item) }}</span>
            </span>
            <button
              type="button"
              class="poster-panel__remove"
              :aria-label="t('poster.remove', { name: item.name })"
              @click="remove(item.id)"
            >
              <UIcon name="i-heroicons-x-mark" size="18" aria-hidden="true" />
            </button>
          </li>
        </ol>
      </div>
      <span class="poster-bar__count">
        <UIcon name="i-heroicons-photo" size="18" aria-hidden="true" />
        {{ t("poster.count", { n: count }) }}
      </span>
      <button
        type="button"
        class="poster-bar__show"
        :aria-expanded="open"
        :aria-controls="panelId"
        @click="open = !open"
      >
        {{ open ? t("poster.hide") : t("poster.show") }}
        <UIcon
          name="i-heroicons-chevron-up"
          size="14"
          aria-hidden="true"
          class="poster-bar__chev"
          :class="{ 'poster-bar__chev--open': open }"
        />
      </button>
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
.poster-bar__show {
  @apply inline-flex min-h-[40px] items-center gap-1 rounded-full px-3 text-[14px] text-gold-light transition hover:bg-white/10;
}
.poster-bar__chev {
  @apply transition-transform duration-200;
}
.poster-bar__chev--open {
  @apply rotate-180;
}
.poster-bar__clear {
  @apply min-h-[40px] rounded-full px-3 text-[14px] text-white/80 transition hover:bg-white/10 hover:text-white;
}
.poster-bar__open {
  @apply inline-flex min-h-[40px] items-center whitespace-nowrap rounded-full bg-gold px-4 text-[14px] font-semibold text-navy transition hover:bg-gold-light active:scale-95;
}

/* Panel sits above the bar, never wider than the screen minus 16px gutters. */
.poster-panel {
  @apply absolute rounded-2xl bg-navy p-2 text-white shadow-[0_10px_30px_rgba(29,43,69,0.3)] ring-1 ring-gold/30 dark:bg-midnight-surface dark:ring-midnight-line;
  left: 0;
  bottom: calc(100% + 10px);
  width: min(22rem, calc(100vw - 2rem));
}
@media (min-width: 1024px) {
  .poster-panel {
    left: 50%;
    translate: -50% 0;
  }
}
.poster-panel__list {
  @apply m-0 flex list-none flex-col gap-1 overflow-y-auto overscroll-contain p-0;
  max-height: min(50vh, 22rem);
}
.poster-panel__row {
  @apply flex items-center gap-2.5 rounded-xl px-1.5 py-1.5;
}
.poster-panel__row:hover {
  @apply bg-white/5;
}
.poster-panel__n {
  @apply inline-flex h-6 min-w-6 shrink-0 items-center justify-center rounded-full bg-gold px-1.5 text-[12px] font-semibold tabular-nums leading-none text-navy;
}
.poster-panel__thumb {
  @apply h-11 w-11 shrink-0 rounded-lg bg-white/10 object-cover;
}
.poster-panel__text {
  @apply flex min-w-0 flex-1 flex-col;
}
.poster-panel__name {
  @apply text-[14px] font-medium leading-snug text-white;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.poster-panel__price {
  @apply truncate text-[13px] text-gold-light;
}
.poster-panel__remove {
  @apply inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white;
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
