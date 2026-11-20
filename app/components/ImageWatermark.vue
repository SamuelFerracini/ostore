<script setup>
// Visible-only watermark: a diagonal tile of logo + Facebook handle laid over
// a product image. It never touches the image file. Place it inside a
// `relative overflow-hidden` container, after the image.
defineProps({
  size: {
    type: String,
    default: "md",
    validator: (v) => ["sm", "md", "lg"].includes(v),
  },
});

const TILES = 24;
</script>

<template>
  <div class="wm" :class="`wm--${size}`" aria-hidden="true">
    <div class="wm__tiles">
      <span v-for="n in TILES" :key="n" class="wm__tile">
        <img src="/logo.png" alt="" class="wm__logo" draggable="false" />
        <span>fb.com/nonlapan.ssw</span>
      </span>
    </div>
  </div>
</template>

<style scoped>
.wm {
  --wm-font: 11px;
  --wm-logo: 14px;
  --wm-gap: 26px;
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
  --wm-gap: 10px;
}
.wm--lg {
  --wm-font: 16px;
  --wm-logo: 20px;
  --wm-gap: 40px;
}
.wm__tiles {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 190%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--wm-gap) calc(var(--wm-gap) * 0.9);
  transform: translate(-50%, -50%) rotate(-30deg);
}
.wm__tile {
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
