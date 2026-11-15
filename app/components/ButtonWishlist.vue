<script setup>
const props = defineProps({
  product: Object,
  size: { type: String, default: 'md' },
});

const { isWishlisted, toggleWishlist } = useWishlist();
const active = computed(() => isWishlisted(props.product));
</script>

<template>
  <button
    type="button"
    :aria-pressed="active"
    :aria-label="active ? 'ลบออกจากรายการโปรด' : 'เพิ่มในรายการโปรด'"
    class="active:scale-95 transition"
    @click.prevent.stop="toggleWishlist(product)">
    <div
      :class="[
        'rounded-full flex justify-center items-center shadow-sm',
        size === 'sm' ? 'w-10 h-10' : 'w-12 h-12 ml-3',
        active ? 'bg-mist dark:bg-midnight-surface' : 'bg-white/90 dark:bg-midnight-surface/90',
      ]">
      <UIcon
        :name="active ? 'i-iconamoon-heart-fill' : 'i-iconamoon-heart'"
        :size="size === 'sm' ? 22 : 26"
        :class="active ? 'text-royal dark:text-periwinkle' : 'text-navy dark:text-night-text'" />
    </div>
  </button>
</template>
