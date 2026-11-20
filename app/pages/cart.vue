<script setup>
import cartStore from "~~/stores/cart";

const { t, tIn } = useLocale();
const { isAdmin } = useAdmin();

const FB_URL = "https://www.facebook.com/share/1AmvwsRi18/?mibextid=wwXIfr";

const cartItems = computed(() => {
  const items = cartStore.getters.cartItems;
  return Array.isArray(items) ? items : [];
});
const cartCount = computed(() => cartStore.getters.cartCount);
const cartTotal = computed(() => cartStore.getters.cartTotal);

const copied = ref(false);
const copyError = ref(false);
const confirmingClear = ref(false);
let copiedTimer;

const fmt = (n) => Number(n || 0).toLocaleString("en-US");
const itemKey = (item) => item.key ?? item.id;

// Reference (comparison) price per unit, or null when it is not above the price.
const referencePrice = (item) => {
  const price = Number(item.price_normalised);
  const market = Number(item.market_thb);
  if (item.market_thb && market > price) {
    return { label: t("common.thaiShopPrice"), value: market };
  }
  const original = Number(item.originalPrice_normalised);
  if (item.originalPrice_normalised && original > price) {
    return { label: t("common.regularPrice"), value: original };
  }
  return null;
};

const savings = computed(() =>
  cartItems.value.reduce((sum, item) => {
    // Not named `ref`: a local `ref` stops Nuxt auto-importing Vue's `ref` for this file.
    const refPrice = referencePrice(item);
    return refPrice
      ? sum + (refPrice.value - Number(item.price_normalised)) * item.quantity
      : sum;
  }, 0)
);

const updateQuantity = (productId, quantity) => {
  cartStore.dispatch("updateQuantity", { productId, quantity });
};

const { confirm } = useConfirm();

const removeFromCart = async (item) => {
  const ok = await confirm({
    title: t("confirm.removeCartTitle"),
    message: item.name
      ? t("confirm.removeCartMessage", { name: item.name })
      : "",
    confirmLabel: t("common.remove"),
    cancelLabel: t("common.cancel"),
  });
  if (ok) cartStore.dispatch("removeFromCart", itemKey(item));
};

const clearCart = () => {
  cartStore.dispatch("clearCart");
  confirmingClear.value = false;
};

const copyToClipboard = async () => {
  const baseUrl = window.location.origin;
  let text = "";
  // The list is pasted to the Thai-speaking seller, so it is always Thai.
  const ot = (key, params) => tIn("th", key, params);

  cartItems.value.forEach((item, index) => {
    text += `${index + 1}. ${item.name}\n`;
    if (item.size) {
      text += `   ${ot("order.size", { size: item.size })}\n`;
    }
    text += `   ${ot("order.price", { amount: fmt(item.price_normalised) })}`;
    text += `   ${ot("order.qty", { n: item.quantity })}\n`;
    text += `   ${ot("order.line", { amount: fmt(Number(item.price_normalised) * item.quantity) })}\n`;
    if (item.category) {
      text += `   ${ot("order.category", { name: getCategoryName(item.category) })}\n`;
    }
    text += `   ${ot("order.link", { url: `${baseUrl}/products?q=${encodeURIComponent(item.name)}` })}\n`;
    text += `\n`;
  });

  text += `${ot("order.count", { count: ot("common.items", { n: cartCount.value }) })}\n`;
  text += `${ot("order.total", { amount: fmt(cartTotal.value) })}\n`;

  try {
    await navigator.clipboard.writeText(text);
    copyError.value = false;
    copied.value = true;
    clearTimeout(copiedTimer);
    copiedTimer = setTimeout(() => {
      copied.value = false;
    }, 2500);
  } catch (err) {
    console.error("Failed to copy:", err);
    copied.value = false;
    copyError.value = true;
  }
};

onBeforeUnmount(() => clearTimeout(copiedTimer));

const focusRing =
  "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-periwinkle";
</script>

<template>
  <div class="mx-auto max-w-[1440px] px-4 lg:px-8 text-navy dark:text-night-text">
    <div class="pt-6 pb-5 lg:pt-9 lg:pb-7">
      <h1
        class="font-display-th text-[26px] lg:text-[34px] font-semibold leading-tight text-navy dark:text-night-text"
      >
        {{ t("cart.title") }}
      </h1>
      <p v-if="cartItems.length" class="mt-1 text-[15px] text-muted dark:text-night-muted">
        {{ t("common.items", { n: cartCount }) }}
      </p>
    </div>

      <EmptyCart v-if="!cartItems.length" />

      <div v-else class="flex flex-wrap gap-6 items-start pb-10">
        <!-- Items -->
        <ul class="list-none p-0 m-0 flex flex-col gap-4 min-w-0" style="flex: 999 1 520px">
          <li
            v-for="item in cartItems"
            :key="itemKey(item)"
            class="flex gap-4 bg-white dark:bg-midnight-surface border border-gold-line dark:border-midnight-line rounded-[20px] p-[14px]"
          >
            <!-- Arched thumbnail -->
            <div
              class="w-24 h-[124px] shrink-0 border border-gold-arch dark:border-gold/40 p-[3px]"
              style="border-radius: 50% 50% 12px 12px / 30% 30% 12px 12px"
            >
              <div
                class="relative w-full h-full bg-photo overflow-hidden"
                style="border-radius: 50% 50% 9px 9px / 30% 30% 9px 9px"
              >
                <NuxtImg
                  :src="item.primaryImage"
                  :alt="item.name"
                  class="w-full h-full object-cover"
                />
                <ImageWatermark size="sm" />
              </div>
            </div>

            <div class="flex-1 min-w-0 flex flex-col gap-2">
              <div class="flex items-start justify-between gap-3">
                <h3 class="font-display text-[21px] leading-snug font-semibold line-clamp-2">
                  {{ item.name }}
                </h3>
                <div class="text-[18px] font-semibold text-royal dark:text-night-gold whitespace-nowrap text-right">
                  {{ fmt(Number(item.price_normalised) * item.quantity) }} &#3647;
                </div>
              </div>

              <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted dark:text-night-muted">
                <span
                  v-if="item.size"
                  class="px-2.5 py-0.5 rounded-full bg-mist dark:bg-midnight-line text-royal dark:text-night-text font-medium"
                >
                  {{ t("common.size", { size: item.size }) }}
                </span>
                <span>{{ fmt(item.price_normalised) }} {{ t("cart.perPiece") }}</span>
                <!-- Hidden for customers on purpose (admins only). Remove isAdmin to turn back on. -->
                <span v-if="isAdmin && referencePrice(item)">
                  {{ referencePrice(item).label }}
                  <s>{{ fmt(referencePrice(item).value) }} &#3647;</s>
                </span>
              </div>

              <div class="flex items-center justify-between gap-3 mt-auto pt-1">
                <div
                  class="inline-flex items-center rounded-full border border-sky dark:border-midnight-line overflow-hidden"
                  role="group"
                  :aria-label="t('cart.qtyAria', { name: item.name })"
                >
                  <button
                    type="button"
                    :class="[
                      'w-11 h-10 flex items-center justify-center text-royal dark:text-night-text hover:bg-mist dark:hover:bg-midnight-line disabled:opacity-40 disabled:hover:bg-transparent transition',
                      focusRing,
                    ]"
                    :aria-label="t('cart.decrease')"
                    :disabled="item.quantity <= 1"
                    @click="updateQuantity(itemKey(item), item.quantity - 1)"
                  >
                    <UIcon name="i-iconamoon-sign-minus-bold" size="18" />
                  </button>
                  <span
                    class="min-w-[2rem] text-center font-semibold"
                    aria-live="polite"
                    >{{ item.quantity }}</span
                  >
                  <button
                    type="button"
                    :class="[
                      'w-11 h-10 flex items-center justify-center text-royal dark:text-night-text hover:bg-mist dark:hover:bg-midnight-line transition',
                      focusRing,
                    ]"
                    :aria-label="t('cart.increase')"
                    @click="updateQuantity(itemKey(item), item.quantity + 1)"
                  >
                    <UIcon name="i-iconamoon-sign-plus-bold" size="18" />
                  </button>
                </div>

                <button
                  type="button"
                  :class="[
                    'inline-flex items-center gap-1.5 min-h-[44px] px-3 rounded-full text-sm text-muted dark:text-night-muted hover:text-navy dark:hover:text-white transition',
                    focusRing,
                  ]"
                  :aria-label="t('cart.removeAria', { name: item.name })"
                  @click="removeFromCart(item)"
                >
                  <UIcon name="i-iconamoon-trash-bold" size="18" />
                  {{ t("cart.removeShort") }}
                </button>
              </div>
            </div>
          </li>
        </ul>

        <!-- Summary -->
        <aside
          class="bg-white dark:bg-midnight-surface border border-gold-line dark:border-midnight-line rounded-[24px] overflow-hidden lg:sticky lg:top-24"
          style="flex: 1 1 340px"
        >
          <div class="h-1 bg-gold dark:bg-night-gold"></div>
          <div class="p-6">
            <h2 class="font-display-th text-xl font-semibold mb-4">{{ t("cart.summary") }}</h2>

            <dl class="m-0 space-y-2">
              <div class="flex justify-between gap-3">
                <dt class="text-muted dark:text-night-muted">{{ t("cart.itemsPrice", { count: t("common.items", { n: cartCount }) }) }}</dt>
                <dd class="m-0">{{ fmt(cartTotal) }} &#3647;</dd>
              </div>
              <div class="flex justify-between gap-3">
                <dt class="text-muted dark:text-night-muted">{{ t("cart.boxBag") }}</dt>
                <dd class="m-0">{{ t("cart.included") }}</dd>
              </div>
              <div class="flex justify-between items-baseline gap-3 pt-3 border-t border-gold-line dark:border-midnight-line">
                <dt class="font-semibold">{{ t("common.total") }}</dt>
                <dd class="m-0 text-[26px] font-semibold text-royal dark:text-night-gold">
                  {{ fmt(cartTotal) }} &#3647;
                </dd>
              </div>
            </dl>

            <!-- Hidden for customers on purpose (admins only). Remove isAdmin to turn back on. -->
            <div
              v-if="isAdmin && savings > 0"
              class="mt-4 flex items-center gap-2 rounded-xl bg-gold-soft dark:bg-night-gold/15 text-[#6E5418] dark:text-[#E2C783] px-3 py-2 text-sm"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" class="shrink-0 fill-gold dark:fill-night-gold" aria-hidden="true">
                <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7L12 17.3 5.8 21l1.6-7L2 9.2l7.1-.6z" />
              </svg>
              {{ t("cart.saved", { amount: fmt(savings) }) }}
            </div>

            <ol class="list-none p-0 my-5 space-y-3">
              <li
                v-for="(step, i) in [
                  t('cart.step1'),
                  t('cart.step2'),
                  t('cart.step3'),
                ]"
                :key="i"
                class="flex items-start gap-3 text-sm"
              >
                <span
                  class="w-6 h-6 shrink-0 rounded-full bg-navy dark:bg-night-gold text-white dark:text-navy text-xs font-semibold flex items-center justify-center"
                  >{{ i + 1 }}</span
                >
                <span class="pt-0.5">{{ step }}</span>
              </li>
            </ol>

            <button
              type="button"
              :class="[
                'w-full h-[54px] rounded-full font-semibold flex items-center justify-center gap-2 transition active:scale-[0.98]',
                copied
                  ? 'bg-mist dark:bg-midnight-line text-navy dark:text-night-text'
                  : 'bg-gold dark:bg-night-gold text-navy hover:brightness-105',
                focusRing,
              ]"
              @click="copyToClipboard"
            >
              <UIcon
                :name="copied ? 'i-iconamoon-check-bold' : 'i-iconamoon-copy-bold'"
                size="20"
              />
              <span aria-live="polite">{{
                copied ? t("cart.copied") : t("cart.copy")
              }}</span>
            </button>
            <p v-if="copyError" role="alert" class="mt-2 text-sm text-muted dark:text-night-muted">
              {{ t("cart.copyFailed") }}
            </p>

            <a
              :href="FB_URL"
              target="_blank"
              rel="noopener"
              :class="[
                'mt-3 w-full h-[54px] rounded-full bg-royal text-white font-semibold flex items-center justify-center gap-2 transition hover:brightness-110 active:scale-[0.98]',
                focusRing,
              ]"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z" />
              </svg>
              {{ t("cart.chatSeller") }}
            </a>

            <div class="mt-4 text-center min-h-[44px]">
              <button
                v-if="!confirmingClear"
                type="button"
                :class="[
                  'min-h-[44px] px-3 rounded-full text-sm underline text-muted dark:text-night-muted',
                  focusRing,
                ]"
                @click="confirmingClear = true"
              >
                {{ t("cart.clear") }}
              </button>
              <div v-else class="flex items-center justify-center gap-2 text-sm" role="group">
                <span class="text-muted dark:text-night-muted">{{ t("cart.clearConfirm") }}</span>
                <button
                  type="button"
                  :class="[
                    'min-h-[44px] px-4 rounded-full bg-navy dark:bg-night-gold text-white dark:text-navy font-medium',
                    focusRing,
                  ]"
                  @click="clearCart"
                >
                  {{ t("common.confirm") }}
                </button>
                <button
                  type="button"
                  :class="[
                    'min-h-[44px] px-4 rounded-full border border-sky dark:border-midnight-line font-medium',
                    focusRing,
                  ]"
                  @click="confirmingClear = false"
                >
                  {{ t("common.cancel") }}
                </button>
              </div>
            </div>

            <p class="mt-2 text-xs text-center text-muted dark:text-night-muted">
              {{ t("cart.priceNote") }}
            </p>
          </div>
        </aside>
      </div>
  </div>
</template>
