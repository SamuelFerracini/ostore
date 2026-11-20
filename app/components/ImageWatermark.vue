<script setup>
// Visible-only watermark: crown logo + Facebook handle badge in the bottom-left of
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
      <svg
        class="wm__logo"
        viewBox="0 -8 48 48"
        fill="none"
        stroke="currentColor"
        stroke-width="2.8"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M5 27c9-3.5 29-3.5 38 0" />
        <path d="M6 27 9 13l7 7.5L24 7l8 13.5 7-7.5 3 14" />
        <circle cx="24" cy="4.2" r="1.9" />
        <circle cx="9" cy="11" r="1.4" />
        <circle cx="39" cy="11" r="1.4" />
        <path d="m24 16 2 3-2 3-2-3Z" />
      </svg>
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
  padding: calc(var(--wm-font) * 0.35) calc(var(--wm-font) * 0.6);
  border-radius: 999px;
  color: #fff;
  background: rgba(17, 24, 39, 0.72);
}
.wm__logo {
  width: var(--wm-logo);
  height: auto;
  flex: none;
  color: #d8b868;
}
</style>
