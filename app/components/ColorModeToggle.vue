<script setup>
// Default preference is "system" (nuxt.config.ts). Clicking flips light <-> dark from the
// current effective theme; @nuxt/color-mode remembers that choice in localStorage.
const colorMode = useColorMode();
const { t } = useLocale();

const isDark = computed(() => colorMode.value === "dark");

const toggle = () => {
  colorMode.preference = isDark.value ? "light" : "dark";
};

const icon = computed(() =>
  isDark.value ? "i-iconamoon-mode-dark-fill" : "i-iconamoon-mode-light-fill"
);
const label = computed(() =>
  isDark.value ? t("colorMode.toLight") : t("colorMode.toDark")
);
</script>

<template>
  <button
    type="button"
    class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-sky dark:border-midnight-line bg-white dark:bg-transparent text-navy dark:text-night-text hover:border-periwinkle transition active:scale-95"
    :aria-label="label"
    :title="label"
    @click="toggle"
  >
    <ClientOnly>
      <UIcon :name="icon" size="20" />
      <template #fallback><span class="h-5 w-5" aria-hidden="true"></span></template>
    </ClientOnly>
  </button>
</template>
