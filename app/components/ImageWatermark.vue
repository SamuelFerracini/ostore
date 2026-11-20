<script setup>
// Visible-only watermark: logo + Facebook handle badge in the bottom-left of
// a product image. It never touches the image file. Place it inside a
// `relative overflow-hidden` container, after the image.
defineProps({
  size: {
    type: String,
    default: "md",
    validator: (v) => ["sm", "md", "lg"].includes(v),
  },
});
</script>

<template>
  <div class="wm" :class="`wm--${size}`" aria-hidden="true">
    <span class="wm__tile">
      <img src="/logo.png" alt="" class="wm__logo" draggable="false" />
      <span>fb.com/nonlapan.ssw</span>
    </span>
  </div>
</template>

<style scoped>
.wm {
  --wm-font: 11px;
  --wm-logo: 14px;
  --wm-pad: 8px;
  position: absolute;
  inset: 0;
  z-index: 5;
  overflow: hidden;
  pointer-events: none;
  user-select: none;
}
.wm--sm {
  --wm-font: 5px;
  --wm-logo: 7px;
  --wm-pad: 4px;
}
.wm--lg {
  --wm-font: 16px;
  --wm-logo: 20px;
  --wm-pad: 12px;
}
.wm__tile {
  position: absolute;
  left: var(--wm-pad);
  bottom: var(--wm-pad);
  display: inline-flex;
  align-items: center;
  gap: calc(var(--wm-font) * 0.4);
  font-size: var(--wm-font);
  font-weight: 600;
  line-height: 1;
  white-space: nowrap;
  color: rgba(255, 255, 255, 0.5);
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.45);
}
.wm__logo {
  width: var(--wm-logo);
  height: auto;
  opacity: 0.55;
  filter: brightness(0) invert(1) drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5));
}
</style>
