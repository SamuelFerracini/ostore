<script setup>
const { order } = useCheckout();
const { t } = useLocale();
</script>

<template>
  <div class="w-[calc(100vw-24px)] sm:w-96 h-full rounded-3xl text-navy dark:text-night-text">
    <div class="flex flex-col items-center justify-center mb-6 mt-8 gap-1 text-center">
      <div class="relative flex rounded-full p-4 mb-1 bg-mist dark:bg-midnight-surface" aria-hidden="true">
        <UIcon name="i-iconamoon-check-circle-1-fill" size="46" class="text-gold dark:text-night-price" />
        <svg width="16" height="16" viewBox="0 0 24 24" class="absolute -top-1 -right-1 fill-periwinkle">
          <path d="M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z" />
        </svg>
      </div>
      <div class="font-display-th text-lg font-semibold">{{ t("pay.success") }}</div>
      <div class="text-sm text-muted dark:text-night-muted">{{ t("pay.thanks") }}</div>
    </div>
    <div class="bg-white dark:bg-midnight-surface border border-gold-line dark:border-midnight-line rounded-2xl p-5 m-5 gap-2 flex flex-col text-sm">
      <div class="flex justify-between items-center">
        <span class="text-muted dark:text-night-muted">{{ t("pay.amount") }}</span>
        <span class="font-semibold text-lg text-royal dark:text-night-price">{{ order.total }}</span>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-muted dark:text-night-muted">{{ t("pay.orderNumber") }}</span>
        <span class="font-semibold">#{{ order.orderNumber }}</span>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-muted dark:text-night-muted">{{ t("pay.date") }}</span>
        <span class="font-semibold">{{ useDateFormat(order.date, 'DD/MM/YYYY') }}</span>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-muted dark:text-night-muted">{{ t("pay.method") }}</span>
        <span class="font-semibold">{{ order.paymentMethodTitle }}</span>
      </div>
    </div>
  </div>
</template>
