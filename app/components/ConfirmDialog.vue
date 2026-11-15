<script setup>
const { state, settle } = useConfirm();

const isOpen = computed({
  get: () => state.value.open,
  // UModal sets false on Esc / backdrop click = cancel
  set: (v) => {
    if (!v) settle(false);
  },
});

const cancelBtn = ref(null);
</script>

<template>
  <UModal
    v-model="isOpen"
    :ui="{
      wrapper: 'relative z-[200]',
      overlay: { background: 'bg-navy/60 dark:bg-black/70' },
      container: 'items-center',
      width: 'sm:max-w-sm',
      rounded: 'rounded-[24px]',
      background: 'bg-white dark:bg-midnight-surface',
      ring: 'ring-1 ring-gold-line dark:ring-midnight-line',
    }"
    :initial-focus="cancelBtn"
    data-confirm-dialog
  >
    <div
      role="alertdialog"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-message"
      class="p-6 text-navy dark:text-[#EEF2F8] font-sans"
    >
      <h2
        id="confirm-dialog-title"
        class="font-display-th text-lg font-semibold"
      >
        {{ state.title }}
      </h2>
      <p
        v-if="state.message"
        id="confirm-dialog-message"
        class="mt-2 text-[15px] text-muted dark:text-[#B7C3D9] break-words"
      >
        {{ state.message }}
      </p>
      <div class="mt-6 flex gap-3">
        <button
          ref="cancelBtn"
          type="button"
          class="flex-1 min-h-[44px] rounded-full border border-gold-line dark:border-midnight-line font-semibold text-navy dark:text-[#EEF2F8] transition hover:bg-mist dark:hover:bg-midnight active:scale-[0.98] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-periwinkle"
          @click="settle(false)"
        >
          {{ state.cancelLabel }}
        </button>
        <button
          type="button"
          class="flex-1 min-h-[44px] rounded-full bg-gold dark:bg-[#D8B868] font-semibold text-navy transition hover:brightness-105 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-periwinkle"
          @click="settle(true)"
        >
          {{ state.confirmLabel }}
        </button>
      </div>
    </div>
  </UModal>
</template>
