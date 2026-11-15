<script setup>
const props = defineProps({
  product: Object,
});

const emit = defineEmits(["change"]);

const { isWishlisted, toggleWishlist } = useWishlist();
const active = computed(() => isWishlisted(props.product));

const { confirm } = useConfirm();

const toggle = async () => {
  if (active.value) {
    const ok = await confirm({
      title: "ลบออกจากรายการโปรด?",
      message: props.product?.name
        ? `ต้องการลบ "${props.product.name}" ออกจากรายการโปรดใช่ไหม`
        : "",
      confirmLabel: "ลบออก",
      cancelLabel: "ยกเลิก",
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
    :aria-label="active ? 'ลบออกจากรายการโปรด' : 'เพิ่มในรายการโปรด'"
    class="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-[0_2px_8px_rgba(29,43,69,0.16)] border border-gold-line/70 transition hover:scale-105 active:scale-95"
  >
    <UIcon
      :name="active ? 'i-iconamoon-heart-fill' : 'i-iconamoon-heart'"
      size="22"
      :class="active ? 'text-royal' : 'text-navy'"
    />
  </button>
</template>
