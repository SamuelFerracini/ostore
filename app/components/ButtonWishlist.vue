<script setup>
const props = defineProps({
  product: Object,
});

const emit = defineEmits(["change"]);

const { isWishlisted, toggleWishlist, wishlist } = useWishlist(props.product);

const toggle = () => {
  // Every button has its own copy of the list; re-read it so a toggle here
  // does not overwrite hearts set on other cards.
  try {
    wishlist.value = JSON.parse(localStorage.getItem("wishlist") || "[]");
  } catch {
    wishlist.value = [];
  }
  toggleWishlist(props.product);
  emit("change", isWishlisted.value);
};
</script>

<template>
  <button
    type="button"
    @click.stop.prevent="toggle"
    :aria-pressed="isWishlisted"
    :aria-label="isWishlisted ? 'เอาออกจากรายการโปรด' : 'เพิ่มในรายการโปรด'"
    class="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-[0_2px_8px_rgba(29,43,69,0.16)] border border-gold-line/70 transition hover:scale-105 active:scale-95"
  >
    <UIcon
      :name="isWishlisted ? 'i-iconamoon-heart-fill' : 'i-iconamoon-heart'"
      size="22"
      :class="isWishlisted ? 'text-gold-text' : 'text-navy'"
    />
  </button>
</template>
