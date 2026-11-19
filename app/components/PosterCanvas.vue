<script setup>
// The poster itself, rendered at full export size (e.g. 1080×1350).
// The builder scales it down for preview and exports this node as PNG.
import "@fontsource/kanit/400.css";
import "@fontsource/kanit/600.css";
import "@fontsource/kanit/800.css";

const props = defineProps({
  items: { type: Array, default: () => [] },
  title: { type: String, default: "" },
  subtitle: { type: String, default: "" },
  footer: { type: String, default: "" },
  credit: { type: String, default: "" },
  width: { type: Number, default: 1080 },
  height: { type: Number, default: 1350 },
});

const emit = defineEmits(["image-error"]);

const isStory = computed(() => props.height / props.width > 1.5);
const rows = computed(() => Math.max(1, Math.ceil(props.items.length / 3)));
const cols = computed(() => Math.min(3, Math.max(1, props.items.length)));
const labels = computed(() => props.items.map((item) => posterLabel(item)));
// Reserve the same label height under every tile so rows stay aligned.
const labelLines = computed(() =>
  Math.max(1, ...labels.value.map((l) => l.split("\n").length)),
);
const footerText = computed(() => props.footer.trim());

const rootStyle = computed(() => ({
  width: `${props.width}px`,
  height: `${props.height}px`,
  "--rows": rows.value,
  "--cols": cols.value,
  "--label-lines": labelLines.value,
}));
</script>

<template>
  <div class="poster" :class="{ 'poster--story': isStory }" :style="rootStyle">
    <p v-if="credit.trim()" class="poster__credit">{{ credit }}</p>

    <header class="poster__head">
      <h1 v-if="title.trim()" class="poster__title">{{ title }}</h1>
      <p v-if="subtitle.trim()" class="poster__subtitle">{{ subtitle }}</p>
    </header>

    <div class="poster__stage">
      <div class="poster__grid">
        <span class="poster__blob" aria-hidden="true" />
        <figure v-for="(item, i) in items" :key="item.id" class="poster__item">
          <div class="poster__tile">
            <img
              :src="posterImageSrc(item.primaryImage)"
              :alt="item.name"
              crossorigin="anonymous"
              decoding="async"
              @error="emit('image-error', item.id)"
            />
          </div>
          <figcaption class="poster__price">{{ labels[i] }}</figcaption>
        </figure>
      </div>
    </div>

    <footer v-if="footerText" class="poster__footer">
      <span class="poster__footer-stroke" aria-hidden="true">{{ footerText }}</span>
      <span class="poster__footer-fill">{{ footerText }}</span>
    </footer>
  </div>
</template>

<style scoped>
.poster {
  --ink: #2b1a2e;
  --rose: #d6336c;
  --blush: #fde3ec;
  --tile-bg: #f7f7f7;
  --pad-x: 64px;
  --gap: 28px;
  --label-size: 32px;
  --label-lh: 1.2;
  --label-gap: 14px;

  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 72px var(--pad-x) 60px;
  background: #ffffff;
  color: var(--ink);
  font-family: "Kanit", "IBM Plex Sans Thai", sans-serif;
  text-align: center;
}
.poster--story {
  /* Keep text clear of Instagram's story chrome at the top and bottom. */
  padding-top: 170px;
  padding-bottom: 190px;
}

.poster__credit {
  position: absolute;
  top: 28px;
  right: 36px;
  margin: 0;
  font-size: 24px;
  font-weight: 400;
  line-height: 1.2;
  color: #7a6577;
}
.poster--story .poster__credit {
  top: 120px;
}

.poster__head {
  flex: none;
}
.poster__title {
  margin: 0;
  font-size: 92px;
  font-weight: 800;
  line-height: 1.08;
  letter-spacing: -0.01em;
  color: var(--ink);
  white-space: pre-line;
  text-wrap: balance;
}
.poster__subtitle {
  margin: 14px 0 0;
  font-size: 40px;
  font-weight: 600;
  line-height: 1.2;
  color: var(--rose);
  text-wrap: balance;
}

.poster__stage {
  position: relative;
  flex: 1 1 auto;
  min-height: 0;
  margin: 36px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  container-type: size;
  /* One tile edge: limited by the width of 3 columns and by the height of all rows. */
  --label-h: calc(var(--label-size) * var(--label-lh) * var(--label-lines) + var(--label-gap));
  --tile: min(
    (100cqw - 2 * var(--gap)) / 3,
    (100cqh - var(--rows) * var(--label-h) - (var(--rows) - 1) * var(--gap)) / var(--rows)
  );
}

.poster__grid {
  position: relative;
  display: grid;
  grid-template-columns: repeat(var(--cols), var(--tile));
  gap: var(--gap);
  justify-content: center;
}

/* The soft pink circle sits behind the grid and grows with it. */
.poster__blob {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 0;
  width: max(
    calc((3 * var(--tile) + 2 * var(--gap)) * 1.06),
    calc(var(--rows) * (var(--tile) + var(--label-h) + var(--gap)) * 1.06)
  );
  aspect-ratio: 1;
  border-radius: 50%;
  background: var(--blush);
  transform: translate(-50%, -50%);
}

.poster__item {
  position: relative;
  z-index: 1;
  margin: 0;
}
.poster__tile {
  width: var(--tile);
  height: var(--tile);
  overflow: hidden;
  border-radius: 24px;
  background: var(--tile-bg);
}
.poster__tile img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.poster__price {
  min-height: calc(var(--label-size) * var(--label-lh) * var(--label-lines));
  margin-top: var(--label-gap);
  font-size: var(--label-size);
  font-weight: 600;
  line-height: var(--label-lh);
  color: var(--ink);
  white-space: pre-line;
  font-variant-numeric: tabular-nums;
}

/* Outlined footer: a thick stroked copy under a plain fill copy, so the
   outline sits outside the letters. */
.poster__footer {
  position: relative;
  flex: none;
  font-size: 50px;
  font-weight: 800;
  line-height: 1.22;
  white-space: pre-line;
}
.poster__footer-stroke {
  display: block;
  color: var(--rose);
  -webkit-text-stroke: 12px var(--rose);
}
.poster__footer-fill {
  position: absolute;
  inset: 0;
  color: #ffffff;
}
</style>
