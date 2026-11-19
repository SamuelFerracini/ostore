<script setup>
import { domToBlob } from "modern-screenshot";

definePageMeta({ middleware: "admin" });

const { t } = useLocale();
const { isAdmin } = useAdmin();
const { items, remove, move, setLabel, clear } = usePosterSelection();

useHead({
  title: () => t("poster.pageTitle"),
  meta: [{ name: "robots", content: "noindex, nofollow" }],
});

// ?admin=0 while on this page: leave it.
watch(isAdmin, (on) => {
  if (!on) navigateTo("/");
});

const SIZES = {
  feed: { width: 1080, height: 1350 },
  story: { width: 1080, height: 1920 },
};

// Text fields, remembered between visits.
const FIELDS_KEY = "ostore_poster_fields";
const DEFAULT_FIELDS = {
  title: "Pandora พรีออเดอร์",
  subtitle: "ของแท้จากออสเตรเลีย ราคารวมกล่องและถุงแล้ว",
  footer: "สนใจทักแชทเพจได้เลย",
  credit: "ดูเพิ่มเติมที่ FB: Nonlapan Saisuwan",
  size: "feed",
};
const fields = reactive({ ...DEFAULT_FIELDS });
const fieldsLoaded = ref(false);

onMounted(() => {
  try {
    const saved = JSON.parse(localStorage.getItem(FIELDS_KEY) || "null");
    if (saved && typeof saved === "object") {
      for (const key of Object.keys(DEFAULT_FIELDS)) {
        if (typeof saved[key] === "string") fields[key] = saved[key];
      }
    }
  } catch (e) {
    // ignore bad or blocked storage
  }
  if (!SIZES[fields.size]) fields.size = "feed";
  fieldsLoaded.value = true;
});

watch(
  fields,
  () => {
    if (!fieldsLoaded.value) return;
    try {
      localStorage.setItem(FIELDS_KEY, JSON.stringify({ ...fields }));
    } catch (e) {
      // storage blocked or full
    }
  },
  { deep: true },
);

const size = computed(() => SIZES[fields.size] || SIZES.feed);

// Preview: scale the full-size poster down to fit the column and the screen.
const frame = ref(null);
const { width: frameWidth } = useElementSize(frame);
const { height: windowHeight } = useWindowSize();
const scale = computed(() => {
  const w = frameWidth.value || 360;
  const h = Math.max(320, windowHeight.value - 200);
  return Math.min(1, w / size.value.width, h / size.value.height);
});
const scaledBox = computed(() => ({
  width: `${Math.round(size.value.width * scale.value)}px`,
  height: `${Math.round(size.value.height * scale.value)}px`,
}));

// Images that failed to load through the proxy.
const failed = ref(new Set());
const onImageError = (id) => {
  failed.value = new Set(failed.value).add(id);
};
watch(
  () => items.value.map((p) => p.id),
  (ids) => {
    const keep = new Set(ids);
    failed.value = new Set([...failed.value].filter((id) => keep.has(id)));
  },
);
const failedCount = computed(
  () => items.value.filter((p) => failed.value.has(p.id)).length,
);

const poster = ref(null);
const exporting = ref(false);
const exportError = ref("");

const waitForAssets = async (root) => {
  await document.fonts.ready;
  const sample = "ก฿ 0123 Aa";
  await Promise.all(
    [400, 600, 800].map((w) => document.fonts.load(`${w} 40px Kanit`, sample)),
  );
  const imgs = [...root.querySelectorAll("img")];
  await Promise.all(
    imgs.map((img) =>
      img.complete
        ? Promise.resolve()
        : new Promise((resolve) => {
            img.addEventListener("load", resolve, { once: true });
            img.addEventListener("error", resolve, { once: true });
          }),
    ),
  );
  await Promise.all(imgs.map((img) => img.decode().catch(() => {})));
  return imgs.filter((img) => !img.naturalWidth).length;
};

const download = async () => {
  const node = poster.value?.$el;
  if (!node || exporting.value || !items.value.length) return;
  exporting.value = true;
  exportError.value = "";
  try {
    const missing = await waitForAssets(node);
    if (missing) {
      exportError.value = t("poster.imagesFailed", { n: missing });
      return;
    }
    const blob = await domToBlob(node, {
      width: size.value.width,
      height: size.value.height,
      scale: 1,
      type: "image/png",
      backgroundColor: "#ffffff",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const stamp = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `poster-${fields.size}-${size.value.width}x${size.value.height}-${stamp}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  } catch (e) {
    exportError.value = t("poster.exportFailed", { msg: e?.message || String(e) });
  } finally {
    exporting.value = false;
  }
};
</script>

<template>
  <div class="builder">
    <div class="builder__head">
      <h1 class="builder__title">{{ t("poster.pageTitle") }}</h1>
      <NuxtLink to="/products" class="builder__link">{{ t("poster.addMore") }}</NuxtLink>
    </div>

    <div class="builder__layout">
      <!-- Controls -->
      <div class="builder__controls">
        <section class="panel" aria-labelledby="poster-text">
          <h2 id="poster-text" class="panel__title">{{ t("poster.text") }}</h2>
          <label class="field">
            <span class="field__label">{{ t("poster.title") }}</span>
            <input v-model="fields.title" type="text" class="field__input" />
          </label>
          <label class="field">
            <span class="field__label">{{ t("poster.subtitle") }}</span>
            <input v-model="fields.subtitle" type="text" class="field__input" />
          </label>
          <label class="field">
            <span class="field__label">{{ t("poster.footer") }}</span>
            <textarea v-model="fields.footer" rows="3" class="field__input field__input--area" />
            <span class="field__hint">{{ t("poster.footerHint") }}</span>
          </label>
          <label class="field">
            <span class="field__label">{{ t("poster.credit") }}</span>
            <input v-model="fields.credit" type="text" class="field__input" />
          </label>
        </section>

        <section class="panel" aria-labelledby="poster-size">
          <h2 id="poster-size" class="panel__title">{{ t("poster.size") }}</h2>
          <div class="segmented" role="radiogroup" :aria-labelledby="'poster-size'">
            <button
              v-for="key in ['feed', 'story']"
              :key="key"
              type="button"
              role="radio"
              :aria-checked="fields.size === key"
              class="segmented__option"
              :class="{ 'segmented__option--on': fields.size === key }"
              @click="fields.size = key"
            >
              <span class="font-semibold">{{ t(`poster.${key}`) }}</span>
              <span class="segmented__dim">{{ SIZES[key].width }}×{{ SIZES[key].height }}</span>
            </button>
          </div>
        </section>

        <section class="panel" aria-labelledby="poster-products">
          <div class="panel__row">
            <h2 id="poster-products" class="panel__title">
              {{ t("poster.products", { n: items.length }) }}
            </h2>
            <button v-if="items.length" type="button" class="text-btn" @click="clear">
              {{ t("poster.clear") }}
            </button>
          </div>

          <div v-if="!items.length" class="empty">
            <p class="empty__title">{{ t("poster.empty") }}</p>
            <p class="empty__hint">{{ t("poster.emptyHint") }}</p>
            <NuxtLink to="/products" class="btn btn--gold">{{ t("poster.browse") }}</NuxtLink>
          </div>

          <ol v-else class="list">
            <li
              v-for="(item, i) in items"
              :key="item.id"
              class="row"
              :class="{ 'row--failed': failed.has(item.id) }"
            >
              <span class="row__n">{{ i + 1 }}</span>
              <img :src="posterImageSrc(item.primaryImage)" alt="" class="row__thumb" />
              <div class="row__body">
                <p class="row__name" :title="item.name">{{ item.name }}</p>
                <textarea
                  :value="item.label"
                  rows="1"
                  class="row__label"
                  :placeholder="posterDefaultLabel(item)"
                  :aria-label="t('poster.labelAria', { name: item.name })"
                  @input="setLabel(item.id, $event.target.value)"
                />
                <p v-if="failed.has(item.id)" class="row__error">{{ t("poster.imageFailed") }}</p>
              </div>
              <div class="row__actions">
                <button
                  type="button"
                  class="icon-btn"
                  :disabled="i === 0"
                  :aria-label="t('poster.moveUp', { name: item.name })"
                  @click="move(i, -1)"
                >
                  <UIcon name="i-heroicons-chevron-up-20-solid" size="20" />
                </button>
                <button
                  type="button"
                  class="icon-btn"
                  :disabled="i === items.length - 1"
                  :aria-label="t('poster.moveDown', { name: item.name })"
                  @click="move(i, 1)"
                >
                  <UIcon name="i-heroicons-chevron-down-20-solid" size="20" />
                </button>
                <button
                  type="button"
                  class="icon-btn icon-btn--remove"
                  :aria-label="t('poster.remove', { name: item.name })"
                  @click="remove(item.id)"
                >
                  <UIcon name="i-heroicons-x-mark-20-solid" size="20" />
                </button>
              </div>
            </li>
          </ol>
          <p v-if="items.length" class="field__hint">{{ t("poster.labelHint") }}</p>
        </section>
      </div>

      <!-- Preview + export -->
      <div class="builder__preview">
        <div class="preview-bar">
          <p class="preview-bar__meta">
            {{
              t("poster.previewMeta", {
                size: `${size.width}×${size.height}`,
                pct: String(Math.round(scale * 100)),
              })
            }}
          </p>
          <button
            type="button"
            class="btn btn--navy"
            :disabled="!items.length || exporting"
            @click="download"
          >
            <UIcon
              :name="exporting ? 'i-svg-spinners-180-ring' : 'i-iconamoon-download-bold'"
              size="18"
              aria-hidden="true"
            />
            {{ exporting ? t("poster.exporting") : t("poster.download") }}
          </button>
        </div>
        <p v-if="exportError" class="preview-error" role="alert">{{ exportError }}</p>
        <p v-else-if="failedCount" class="preview-error" role="status">
          {{ t("poster.imagesFailed", { n: failedCount }) }}
        </p>

        <div ref="frame" class="preview-frame">
          <div class="preview-box" :style="scaledBox">
            <div class="preview-scale" :style="{ transform: `scale(${scale})` }">
              <ClientOnly>
                <PosterCanvas
                  ref="poster"
                  :items="items"
                  :title="fields.title"
                  :subtitle="fields.subtitle"
                  :footer="fields.footer"
                  :credit="fields.credit"
                  :width="size.width"
                  :height="size.height"
                  @image-error="onImageError"
                />
              </ClientOnly>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.builder {
  @apply mx-auto max-w-[1280px] px-4 pb-16 pt-6 lg:px-8 lg:pt-10;
}
.builder__head {
  @apply mb-6 flex flex-wrap items-baseline justify-between gap-3;
}
.builder__title {
  @apply font-display-th text-[28px] font-semibold text-navy dark:text-night-text lg:text-[34px];
}
.builder__link {
  @apply text-[15px] text-royal underline underline-offset-2 dark:text-night-price;
}

.builder__layout {
  @apply grid gap-8 lg:grid-cols-[minmax(340px,420px)_1fr] lg:items-start;
}
.builder__controls {
  @apply order-2 flex flex-col gap-5 lg:order-1;
}
.builder__preview {
  @apply order-1 flex min-w-0 flex-col gap-3 lg:sticky lg:top-6 lg:order-2;
}

.panel {
  @apply rounded-[20px] border border-gold-line bg-white p-5 dark:border-midnight-line dark:bg-midnight-surface;
}
.panel__row {
  @apply flex items-center justify-between gap-3;
}
.panel__title {
  @apply mb-3 text-[17px] font-semibold text-navy dark:text-night-text;
}
.panel__row .panel__title {
  @apply mb-0;
}

.field {
  @apply mb-4 flex flex-col gap-1.5 last:mb-0;
}
.field__label {
  @apply text-[14px] font-medium text-muted dark:text-night-muted;
}
.field__input {
  @apply min-h-[44px] w-full rounded-xl border border-sky bg-field px-3 text-[16px] text-navy outline-none transition focus:border-royal focus:bg-white dark:border-midnight-line dark:bg-midnight dark:text-night-text dark:focus:border-periwinkle;
}
.field__input--area {
  @apply resize-y py-2.5 leading-snug;
}
.field__hint {
  @apply text-[13px] text-muted dark:text-night-muted;
}

.segmented {
  @apply grid grid-cols-2 gap-2;
}
.segmented__option {
  @apply flex min-h-[56px] flex-col items-center justify-center rounded-xl border border-sky bg-white text-[15px] text-navy transition hover:border-periwinkle dark:border-midnight-line dark:bg-midnight dark:text-night-text;
}
.segmented__option--on {
  @apply border-royal bg-mist text-royal ring-1 ring-royal dark:border-periwinkle dark:bg-midnight dark:text-night-price dark:ring-periwinkle;
}
.segmented__dim {
  @apply text-[13px] tabular-nums text-muted dark:text-night-muted;
}

.text-btn {
  @apply min-h-[36px] rounded-full px-3 text-[14px] text-royal transition hover:bg-mist dark:text-night-price dark:hover:bg-midnight;
}

.list {
  @apply mt-3 flex flex-col gap-2;
}
.row {
  @apply flex items-start gap-3 rounded-2xl border border-transparent bg-field p-2.5 dark:bg-midnight;
}
.row--failed {
  @apply border-alizarin-crimson-300;
}
.row__n {
  @apply mt-1 w-5 flex-none text-center text-[14px] font-semibold tabular-nums text-muted dark:text-night-muted;
}
.row__thumb {
  @apply h-14 w-14 flex-none rounded-xl bg-photo object-contain;
}
.row__body {
  @apply flex min-w-0 flex-1 flex-col gap-1.5;
}
.row__name {
  @apply truncate text-[14px] font-medium text-navy dark:text-night-text;
}
.row__label {
  @apply min-h-[36px] w-full resize-y rounded-lg border border-sky bg-white px-2.5 py-1.5 text-[14px] leading-snug text-navy outline-none transition placeholder:text-navy/60 focus:border-royal dark:border-midnight-line dark:bg-midnight-surface dark:text-night-text dark:placeholder:text-night-muted;
}
.row__error {
  @apply text-[13px] text-alizarin-crimson-700 dark:text-alizarin-crimson-300;
}
.row__actions {
  @apply flex flex-none flex-col items-center;
}
.icon-btn {
  @apply flex h-9 w-9 items-center justify-center rounded-full text-navy transition hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent dark:text-night-text dark:hover:bg-midnight-surface;
}
.icon-btn--remove {
  @apply text-muted hover:text-alizarin-crimson-700 dark:text-night-muted;
}

.empty {
  @apply mt-3 flex flex-col items-start gap-2 rounded-2xl bg-field p-4 dark:bg-midnight;
}
.empty__title {
  @apply text-[15px] font-semibold text-navy dark:text-night-text;
}
.empty__hint {
  @apply text-[14px] text-muted dark:text-night-muted;
}

.btn {
  @apply inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full px-5 text-[15px] font-semibold transition active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100;
}
.btn--gold {
  @apply mt-1 bg-gold text-navy hover:bg-gold-light;
}
.btn--navy {
  @apply bg-navy text-gold-light hover:bg-royal dark:bg-gold dark:text-navy dark:hover:bg-gold-light;
}

.preview-bar {
  @apply flex items-center justify-between gap-3;
}
.preview-bar__meta {
  @apply text-[14px] tabular-nums text-muted dark:text-night-muted;
}
.preview-error {
  @apply rounded-xl bg-alizarin-crimson-50 px-3 py-2 text-[14px] text-alizarin-crimson-800 dark:bg-alizarin-crimson-950 dark:text-alizarin-crimson-200;
}

.preview-frame {
  @apply flex w-full justify-center;
}
.preview-box {
  @apply relative overflow-hidden rounded-md shadow-[0_18px_50px_rgba(29,43,69,0.18)] ring-1 ring-gold-line dark:ring-midnight-line;
}
.preview-scale {
  @apply absolute left-0 top-0;
  transform-origin: top left;
}
</style>
