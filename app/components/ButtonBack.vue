<script setup>
const { t } = useLocale();
</script>

<template>
  <div class="fixed px-7 mt-0.5 -left-1.5 max-2xl:hidden z-30">
    <button
      type="button"
      @click.prevent="useRouter().back()"
      class="flex min-h-[44px] items-center gap-2 rounded-full border border-sky bg-white px-4 text-[15px] font-medium text-navy hover:border-periwinkle active:scale-95 transition dark:border-midnight-line dark:bg-midnight-surface dark:text-night-text"
    >
      <UIcon name="i-iconamoon-arrow-left-1-bold" size="20" aria-hidden="true" />
      {{ t("common.back") }}
    </button>
  </div>
</template>
