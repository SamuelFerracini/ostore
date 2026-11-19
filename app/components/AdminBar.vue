<script setup>
const { isAdmin, exit } = useAdmin();
const { t } = useLocale();

// Body class (SSR-rendered from the cookie) offsets the sticky header.
useHead({
  bodyAttrs: { class: computed(() => (isAdmin.value ? "admin-bar-on" : "")) },
});
</script>

<template>
  <div
    v-if="isAdmin"
    role="region"
    :aria-label="t('admin.bar')"
    class="sticky top-0 z-50 flex h-9 w-full items-center justify-between gap-3 bg-[#b42318] px-3 text-sm font-semibold text-white lg:px-5"
  >
    <span class="truncate uppercase tracking-wide">{{ t("admin.bar") }}</span>
    <button
      type="button"
      :aria-label="t('admin.exitLabel')"
      class="min-h-7 shrink-0 rounded-full bg-white px-3 text-[13px] font-bold text-[#b42318] transition hover:bg-ivory active:scale-95"
      @click="exit"
    >
      {{ t("admin.exit") }}
    </button>
  </div>
</template>
