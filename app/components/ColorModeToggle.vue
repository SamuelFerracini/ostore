<script setup>
// Cycles system -> light -> dark -> system, so a user can always return to following the device.
const colorMode = useColorMode();
const { t } = useLocale();

const order = ["system", "light", "dark"];
const icons = {
  system: "i-heroicons-computer-desktop",
  light: "i-iconamoon-mode-light-fill",
  dark: "i-iconamoon-mode-dark-fill",
};

const next = computed(
  () => order[(order.indexOf(colorMode.preference) + 1) % order.length]
);

const cycle = () => {
  colorMode.preference = next.value;
};

const icon = computed(() => icons[colorMode.preference] || icons.system);
const label = computed(() =>
  t("colorMode.switchTo", { mode: t(`colorMode.${next.value}`) })
);
</script>

<template>
  <button
    type="button"
    class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-sky dark:border-midnight-line bg-white dark:bg-transparent text-navy dark:text-night-text hover:border-periwinkle transition active:scale-95"
    :aria-label="label"
    :title="label"
    @click="cycle"
  >
    <ClientOnly>
      <UIcon :name="icon" size="20" />
      <template #fallback><span class="h-5 w-5" aria-hidden="true"></span></template>
    </ClientOnly>
  </button>
</template>
