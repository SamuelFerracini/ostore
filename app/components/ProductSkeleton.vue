<script setup>
const { t } = useLocale();
</script>

<template>
  <div class="justify-center flex flex-col lg:flex-row lg:mx-5">
    <ButtonBack />
    <div class="mr-6 mt-5 pt-2.5 gap-3 flex flex-col max-xl:hidden">
      <div class="h-20 w-14 p-1 relative" v-for="i in 6" :key="i">
        <div class="skeleton bg-mist dark:bg-midnight-surface w-full h-full rounded-lg"></div>
      </div>
    </div>
    <div
      class="flex lg:p-5 lg:gap-5 flex-col w-full lg:w-[1110px] lg:flex-row lg:border lg:border-gold-line lg:bg-white lg:dark:bg-midnight-surface lg:dark:border-midnight-line lg:rounded-[32px] lg:mt-2.5">
      <div class="w-[600px] h-[600px] max-lg:hidden">
        <div class="skeleton-arch h-full w-[450px] mx-auto">
          <div class="skeleton-arch__photo skeleton h-full"></div>
        </div>
      </div>
      <div class="w-full max-lg:h-72 flex flex-row items-center justify-center">
        <div class="bg-mist dark:bg-midnight-surface flex rounded-full w-12 h-12 items-center justify-center skeleton" role="status" :aria-label="t('common.loading')">
          <UIcon class="text-royal dark:text-night-price" name="i-svg-spinners-8-dots-rotate" size="26" />
        </div>
      </div>
    </div>
  </div>
</template>
