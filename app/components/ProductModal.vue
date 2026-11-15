<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import cartStore from "~~/stores/cart";

const { product, isOpen, close } = useProductModal();

const dialogEl = ref(null);
const closeBtn = ref(null);
const activeIndex = ref(0);
const selectedSize = ref(null);
const swiperRef = ref(null);
let trigger = null;

// ---- images -------------------------------------------------------------
const images = computed(() => {
  const p = product.value;
  if (!p) return [];
  const raw = [
    p.primaryImage,
    p.hoverImage,
    p.image2,
    ...(Array.isArray(p.images) ? p.images : []),
  ];
  const out = [];
  for (const v of raw) {
    const src = typeof v === "string" ? v : v?.url ?? v?.src ?? "";
    if (src && !out.includes(src)) out.push(src);
  }
  return out;
});

const go = (delta) => {
  const n = images.value.length;
  if (n < 2) return;
  const next = (activeIndex.value + delta + n) % n;
  activeIndex.value = next;
  swiperRef.value?.slideTo(next);
};
const onSlideChange = (s) => {
  activeIndex.value = s.activeIndex;
};
const onSwiper = (s) => {
  swiperRef.value = s;
};

// ---- pricing ------------------------------------------------------------
const fmt = (n) => `${Math.round(Number(n)).toLocaleString("en-US")} ฿`;
const price = computed(() => Number(product.value?.price_normalised) || 0);
const reference = computed(() => {
  const p = product.value;
  if (!p) return null;
  if (p.market_thb && p.market_thb > price.value) {
    return { label: "ราคาที่ช็อปไทย", value: Number(p.market_thb) };
  }
  if (p.originalPrice_normalised && p.originalPrice_normalised > price.value) {
    return { label: "ปกติ", value: Number(p.originalPrice_normalised) };
  }
  return null;
});
const saving = computed(() =>
  reference.value ? reference.value.value - price.value : 0,
);
const percent = computed(() =>
  reference.value && saving.value > 0
    ? Math.round((saving.value / reference.value.value) * 100)
    : 0,
);

// ---- rings --------------------------------------------------------------
const categoryId = computed(
  () =>
    product.value?.category ??
    (product.value?.categories || []).find((c) =>
      ["rings", "charms", "charm", "bracelets", "necklaces", "earrings"].includes(c),
    ) ??
    product.value?.categories?.[0] ??
    "",
);
const isRing = computed(
  () =>
    categoryId.value === "rings" ||
    (product.value?.categories || []).includes("rings") ||
    /Ring/.test(product.value?.name || ""),
);
const sizes = computed(() => product.value?.sizes || []);
const categoryLabel = computed(() => {
  const map = {
    rings: "แหวน",
    charms: "ชาร์ม",
    charm: "ชาร์ม",
    bracelets: "กำไล",
    necklaces: "สร้อยคอ",
    earrings: "ต่างหู",
    "charms-and-bracelets": "ชาร์มและกำไล",
  };
  return map[categoryId.value] ?? categoryId.value;
});

// ---- cart ---------------------------------------------------------------
const needsSize = computed(() => isRing.value && sizes.value.length > 0);
const lineKey = computed(() =>
  product.value
    ? selectedSize.value
      ? `${product.value.id}::${selectedSize.value}`
      : product.value.id
    : "",
);
const inCart = computed(() =>
  cartStore.state.items.some((i) => (i.key ?? i.id) === lineKey.value),
);
const ctaLabel = computed(() => {
  if (inCart.value) return "อยู่ในตะกร้าแล้ว";
  if (needsSize.value && !selectedSize.value) return "เลือกไซส์ก่อน";
  return selectedSize.value
    ? `ใส่ตะกร้า · ไซส์ ${selectedSize.value}`
    : "ใส่ตะกร้า";
});
const ctaDisabled = computed(
  () => needsSize.value && !selectedSize.value && !inCart.value,
);
const onCta = () => {
  if (ctaDisabled.value) return;
  if (inCart.value) {
    cartStore.dispatch("removeFromCart", lineKey.value);
    return;
  }
  const p = product.value;
  cartStore.dispatch("addToCart", {
    ...p,
    ...(selectedSize.value ? { size: selectedSize.value } : {}),
  });
};

// ---- wishlist ------------------------------------------------------------
const { isWishlisted, toggleWishlist } = useWishlist();
const active = computed(() => isWishlisted(product.value?.id));
const onWish = () => toggleWishlist(product.value);

// ---- a11y: focus trap, scroll lock, Esc ---------------------------------
const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),[tabindex]:not([tabindex="-1"])';
const onKeydown = (e) => {
  if (!isOpen.value) return;
  if (e.key === "Escape") {
    e.preventDefault();
    close();
    return;
  }
  if (e.key === "ArrowLeft" && !e.target.closest?.("fieldset")) go(-1);
  if (e.key === "ArrowRight" && !e.target.closest?.("fieldset")) go(1);
  if (e.key !== "Tab" || !dialogEl.value) return;
  const els = [...dialogEl.value.querySelectorAll(FOCUSABLE)].filter(
    (el) => el.offsetParent !== null,
  );
  if (!els.length) return;
  const first = els[0];
  const last = els[els.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  } else if (!dialogEl.value.contains(document.activeElement)) {
    e.preventDefault();
    first.focus();
  }
};

watch(isOpen, async (open) => {
  if (!import.meta.client) return;
  if (open) {
    trigger = document.activeElement;
    activeIndex.value = 0;
    selectedSize.value = null;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeydown);
    await nextTick();
    closeBtn.value?.focus();
  } else {
    document.body.style.overflow = "";
    document.removeEventListener("keydown", onKeydown);
    if (trigger && document.contains(trigger)) trigger.focus();
    trigger = null;
  }
});
watch(product, () => {
  activeIndex.value = 0;
  selectedSize.value = null;
});
onBeforeUnmount(() => {
  if (!import.meta.client) return;
  document.body.style.overflow = "";
  document.removeEventListener("keydown", onKeydown);
});
</script>

<template>
  <Teleport to="body">
    <Transition name="pm">
      <div
        v-if="isOpen && product"
        class="pm-root fixed inset-0 z-[100] flex items-end md:items-center justify-center"
      >
        <div
          class="pm-backdrop absolute inset-0 bg-navy/60"
          aria-hidden="true"
          @click="close"
        />
        <div
          ref="dialogEl"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pm-title"
          class="pm-dialog relative flex flex-col md:flex-row bg-white dark:bg-midnight-surface text-navy dark:text-[#EEF2F8] w-full h-[calc(100dvh-40px)] rounded-t-[28px] md:rounded-[28px] md:w-[min(1120px,calc(100vw-48px))] md:h-[min(740px,calc(100dvh-48px))] overflow-hidden shadow-2xl font-sans"
        >
          <div
            class="absolute inset-x-0 top-0 h-1 bg-gold dark:bg-[#D8B868] z-30"
          />

          <!-- phone grabber -->
          <div
            class="md:hidden absolute top-2 inset-x-0 flex justify-center z-30 pointer-events-none"
            aria-hidden="true"
          >
            <span class="h-1 w-10 rounded-full bg-black/25" />
          </div>

          <button
            ref="closeBtn"
            type="button"
            aria-label="ปิด"
            class="absolute top-4 right-4 z-40 h-10 w-10 rounded-full bg-white/90 dark:bg-midnight text-navy dark:text-[#EEF2F8] border border-gold-line dark:border-midnight-line flex items-center justify-center hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-royal dark:focus-visible:outline-[#D8B868]"
            @click="close"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </svg>
          </button>

          <!-- ============ gallery ============ -->
          <div
            class="shrink-0 md:w-[58%] md:flex md:gap-4 md:p-8 md:pt-9 bg-photo dark:bg-midnight"
          >
            <!-- thumbs (desktop) -->
            <div
              v-if="images.length > 1"
              class="hidden md:flex flex-col gap-3 overflow-y-auto pr-1"
              role="group"
              aria-label="รูปสินค้า"
            >
              <button
                v-for="(src, i) in images"
                :key="src"
                type="button"
                class="shrink-0 w-[88px] h-[110px] rounded-xl overflow-hidden border-2 bg-photo focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal"
                :class="
                  i === activeIndex
                    ? 'border-gold dark:border-[#D8B868]'
                    : 'border-gold-line dark:border-midnight-line'
                "
                :aria-label="`รูปที่ ${i + 1}`"
                :aria-current="i === activeIndex"
                @click="
                  activeIndex = i;
                  swiperRef?.slideTo(i);
                "
              >
                <img :src="src" alt="" class="w-full h-full object-cover" loading="lazy" />
              </button>
            </div>

            <!-- main -->
            <div class="relative flex-1 min-w-0 md:h-full">
              <div
                class="pm-arch-outer h-[46dvh] md:h-full p-[6px] border border-gold-arch dark:border-midnight-line"
              >
                <div class="pm-arch-inner relative h-full overflow-hidden bg-photo">
                  <Swiper
                    class="h-full"
                    :modules="[Pagination]"
                    :pagination="{ clickable: true }"
                    :slides-per-view="1"
                    @swiper="onSwiper"
                    @slide-change="onSlideChange"
                  >
                    <SwiperSlide v-for="(src, i) in images" :key="src">
                      <img
                        :src="src"
                        :alt="`${product.name} ${i + 1}`"
                        class="w-full h-full object-contain"
                        :loading="i === 0 ? 'eager' : 'lazy'"
                      />
                    </SwiperSlide>
                  </Swiper>

                  <template v-if="images.length > 1">
                    <button
                      type="button"
                      aria-label="รูปก่อนหน้า"
                      class="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 z-10 h-11 w-11 rounded-full bg-white text-navy shadow items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-royal"
                      @click="go(-1)"
                    >
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M11 3L5 9l6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
                    </button>
                    <button
                      type="button"
                      aria-label="รูปถัดไป"
                      class="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 z-10 h-11 w-11 rounded-full bg-white text-navy shadow items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-royal"
                      @click="go(1)"
                    >
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M7 3l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
                    </button>
                    <span
                      class="hidden md:block absolute bottom-4 left-1/2 -translate-x-1/2 z-10 rounded-full bg-white/90 px-3 py-1 text-xs text-navy"
                      aria-live="polite"
                    >
                      {{ activeIndex + 1 }} / {{ images.length }}
                    </span>
                  </template>

                  <span
                    v-if="percent > 0"
                    class="absolute top-4 left-4 z-10 rounded-full bg-gold px-3 py-1 text-sm font-semibold text-navy"
                  >
                    −{{ percent }}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- ============ details ============ -->
          <div class="flex-1 min-h-0 flex flex-col md:w-[42%]">
            <div class="flex-1 overflow-y-auto px-5 pt-5 md:px-9 md:pt-10 pb-4">
              <p class="text-sm font-medium text-gold-text dark:text-[#D8B868]">
                {{ categoryLabel }}
              </p>
              <h2
                id="pm-title"
                class="font-display text-[27px] md:text-[44px] leading-[1.1] font-semibold mt-1"
              >
                {{ product.name }}
              </h2>

              <p class="mt-4 text-[28px] font-semibold text-royal dark:text-[#EEF2F8]">
                {{ fmt(price) }}
              </p>
              <p v-if="reference" class="text-sm text-muted dark:text-[#9AA8C2]">
                {{ reference.label }}
                <s>{{ fmt(reference.value) }}</s>
              </p>
              <p
                v-if="saving > 0"
                class="mt-3 inline-flex items-center gap-1.5 rounded-full bg-gold-soft dark:bg-midnight px-3 py-1 text-sm font-medium text-[#6E5418] dark:text-[#D8B868]"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M6 0l1.7 4.2L12 4.6 8.7 7.5 9.7 12 6 9.6 2.3 12l1-4.5L0 4.6l4.3-.4z" fill="#C5A253" /></svg>
                ประหยัด {{ fmt(saving) }}
              </p>

              <fieldset v-if="isRing && sizes.length" class="mt-6 border-0 p-0 m-0">
                <div class="flex items-baseline justify-between gap-3 mb-3">
                  <legend class="text-sm font-semibold p-0">
                    เลือกไซส์ (EU) ·
                    {{ selectedSize ? `ไซส์ ${selectedSize}` : "ยังไม่ได้เลือก" }}
                  </legend>
                  <a href="#" class="text-sm text-royal dark:text-[#D8B868] underline underline-offset-2">
                    วิธีวัดไซส์แหวน
                  </a>
                </div>
                <div class="grid grid-cols-7 gap-1.5">
                  <button
                    v-for="s in sizes"
                    :key="s.value"
                    type="button"
                    :disabled="s.available === false"
                    :aria-pressed="selectedSize === s.value"
                    :aria-label="s.available === false ? `ไซส์ ${s.value} หมด` : `ไซส์ ${s.value}`"
                    class="h-[50px] min-w-0 rounded-xl border text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal dark:focus-visible:outline-[#D8B868]"
                    :class="
                      s.available === false
                        ? 'bg-[#F2F2EF] text-[#7B8599] line-through border-transparent cursor-not-allowed dark:bg-midnight dark:text-[#6C7893]'
                        : selectedSize === s.value
                          ? 'bg-royal text-white border-royal dark:bg-[#D8B868] dark:text-navy dark:border-[#D8B868]'
                          : 'bg-white text-navy border-sky hover:border-royal dark:bg-midnight-surface dark:text-[#EEF2F8] dark:border-midnight-line'
                    "
                    @click="selectedSize = s.value"
                  >
                    {{ s.value }}
                  </button>
                </div>
                <div class="mt-3 flex gap-4 text-xs text-muted dark:text-[#9AA8C2]">
                  <span class="inline-flex items-center gap-1.5"><i class="h-3 w-3 rounded border border-sky bg-white" />มีของ</span>
                  <span class="inline-flex items-center gap-1.5"><i class="h-3 w-3 rounded bg-[#F2F2EF]" />หมด</span>
                </div>
              </fieldset>

              <ul
                class="mt-6 rounded-2xl bg-mist dark:bg-midnight p-4 text-sm leading-relaxed space-y-1 list-disc list-inside"
              >
                <li>ราคารวมกล่องและถุงแล้ว</li>
                <li>ราคาอาจเปลี่ยนแปลงตามโปรช่วงนั้น</li>
                <li>ต้องการใบเสร็จ ทักสอบถามได้นะคะ</li>
              </ul>
            </div>

            <!-- CTA bar -->
            <div
              class="shrink-0 border-t border-gold-line dark:border-midnight-line bg-white dark:bg-midnight-surface px-5 md:px-9 pt-3 pb-[max(12px,env(safe-area-inset-bottom))]"
            >
              <div class="flex items-center gap-3">
                <button
                  type="button"
                  :disabled="ctaDisabled"
                  class="flex-1 h-14 rounded-full font-semibold text-navy transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal"
                  :class="
                    inCart
                      ? 'bg-royal text-white'
                      : ctaDisabled
                        ? 'bg-[#EDE3C9] cursor-not-allowed dark:bg-midnight dark:text-[#9AA8C2]'
                        : 'bg-gold hover:bg-gold-light dark:bg-[#D8B868]'
                  "
                  @click="onCta"
                >
                  {{ ctaLabel }}
                </button>
                <button
                  type="button"
                  class="h-14 w-14 shrink-0 rounded-full border border-gold-line dark:border-midnight-line flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal"
                  :aria-pressed="active"
                  :aria-label="active ? 'เอาออกจากรายการโปรด' : 'เพิ่มในรายการโปรด'"
                  @click="onWish"
                >
                  <UIcon
                    :name="active ? 'i-iconamoon-heart-fill' : 'i-iconamoon-heart'"
                    size="26"
                    :class="active ? 'text-alizarin-crimson-500' : ''"
                  />
                </button>
              </div>
              <a
                v-if="product.link"
                :href="product.link"
                target="_blank"
                rel="noopener noreferrer"
                class="mt-2 block text-center text-sm text-royal dark:text-[#D8B868] underline underline-offset-2"
              >
                ดูบนเว็บ Pandora
              </a>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.pm-arch-outer {
  border-radius: 50% 50% 22px 22px / 26% 26% 22px 22px;
}
.pm-arch-inner {
  border-radius: 50% 50% 18px 18px / 25% 25% 18px 18px;
}
:deep(.swiper-pagination-bullet-active) {
  background: #c5a253;
}
@media (min-width: 768px) {
  :deep(.swiper-pagination) {
    display: none;
  }
}
.pm-enter-active,
.pm-leave-active {
  transition: opacity 0.2s ease;
}
.pm-enter-active .pm-dialog,
.pm-leave-active .pm-dialog {
  transition: transform 0.25s ease;
}
.pm-enter-from,
.pm-leave-to {
  opacity: 0;
}
.pm-enter-from .pm-dialog,
.pm-leave-to .pm-dialog {
  transform: translateY(24px);
}
@media (prefers-reduced-motion: reduce) {
  .pm-enter-active,
  .pm-leave-active,
  .pm-enter-active .pm-dialog,
  .pm-leave-active .pm-dialog {
    transition: none;
  }
  .pm-enter-from .pm-dialog,
  .pm-leave-to .pm-dialog {
    transform: none;
  }
}
</style>
