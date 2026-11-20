<script setup>
const props = defineProps({
  product: Object,
});

const emit = defineEmits(["change"]);
const { t } = useLocale();

const { isWishlisted, toggleWishlist } = useWishlist();
const active = computed(() => isWishlisted(props.product));

const { confirm } = useConfirm();

const toggle = async () => {
  if (active.value) {
    const ok = await confirm({
      title: t("confirm.removeWishTitle"),
      message: props.product?.name
        ? t("confirm.removeWishMessage", { name: props.product.name })
        : "",
      confirmLabel: t("common.remove"),
      cancelLabel: t("common.cancel"),
    });
    if (!ok) return;
  }
  toggleWishlist(props.product);
  emit("change", active.value);
};
</script>

<template>
  <button
    type="button"
    @click.stop.prevent="toggle"
    :aria-pressed="active"
    :aria-label="active ? t('wish.removeAria') : t('wish.addAria')"
    class="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-[0_2px_8px_rgba(46,36,40,0.16)] border border-gold-line/70 transition hover:scale-105 active:scale-95"
  >
    <UIcon
      :name="active ? 'i-iconamoon-heart-fill' : 'i-iconamoon-heart'"
      size="22"
      :class="active ? 'text-royal' : 'text-navy'"
    />
  </button>
</template>
