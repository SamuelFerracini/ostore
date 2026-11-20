<script setup>
import cartStore from "~~/stores/cart";

const { order } = useCheckout();
const { t } = useLocale();

const items = computed(() => cartStore.getters.cartItems);
const cartCount = computed(() => cartStore.getters.cartCount);
const cartTotal = computed(() => cartStore.getters.cartTotal);

const fmt = (n) => Number(n || 0).toLocaleString("en-US");
const itemKey = (item) => item.key ?? item.id;

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
</script>

<template>
  <div
    class="select-none mx-3 lg:mx-5 shadow-2xl mt-20 rounded-[2rem] right-0 fixed flex z-50 bg-ivory/95 dark:bg-midnight/95 border border-gold-line dark:border-midnight-line text-navy dark:text-night-text backdrop-blur-lg overflow-hidden"
  >
    <Transition name="fade" mode="out-in">
      <PaymentSuccessful v-if="order?.orderNumber && !items.length" />
      <div
        v-else-if="items.length"
        class="flex flex-col w-[calc(100vw-24px)] sm:w-96 max-h-[calc(100vh-110px)]"
      >
        <div class="h-1 bg-gold dark:bg-night-price shrink-0"></div>
        <div class="px-5 pt-4 pb-1 flex items-baseline justify-between shrink-0">
          <div class="font-display-th text-lg font-semibold">{{ t("cart.title") }}</div>
          <div class="text-sm text-muted dark:text-night-muted">{{ t("common.items", { n: cartCount }) }}</div>
        </div>

        <div class="overflow-auto px-3 pb-2">
          <TransitionGroup name="cart-item" tag="ul" class="list-none p-0 m-0">
            <li
              v-for="item in items"
              :key="itemKey(item)"
              class="flex gap-3 items-center bg-white dark:bg-midnight-surface border border-gold-line dark:border-midnight-line rounded-2xl p-2.5 mt-2"
            >
              <div
                class="w-14 h-[72px] shrink-0 border border-gold-arch dark:border-[#4A3A33] p-[2px]"
                style="border-radius: 50% 50% 10px 10px / 30% 30% 10px 10px"
              >
                <div
                  class="w-full h-full bg-photo overflow-hidden"
                  style="border-radius: 50% 50% 8px 8px / 30% 30% 8px 8px"
                >
                  <NuxtImg
                    :src="item.primaryImage"
                    :alt="item.name"
                    class="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <div class="font-display text-base font-semibold leading-snug line-clamp-2">
                  {{ item.name }}
                </div>
                <div class="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1 text-sm">
                  <span
                    v-if="item.size"
                    class="px-2 rounded-full bg-mist dark:bg-midnight-line text-royal dark:text-night-text text-xs font-medium"
                    >{{ t("common.size", { size: item.size }) }}</span
                  >
                  <span class="text-royal dark:text-night-price font-semibold">
                    {{ fmt(item.price_normalised) }} &#3647;
                  </span>
                  <span class="text-muted dark:text-night-muted">× {{ item.quantity }}</span>
                </div>
              </div>
              <button
                type="button"
                class="w-11 h-11 shrink-0 flex items-center justify-center rounded-full text-muted dark:text-night-muted hover:bg-mist dark:hover:bg-midnight-line transition focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-periwinkle"
                :aria-label="t('cart.removeAria', { name: item.name })"
                @click="removeFromCart(item)"
              >
                <UIcon name="i-iconamoon-trash-bold" size="20" />
              </button>
            </li>
          </TransitionGroup>
        </div>

        <div class="px-5 pt-3 pb-5 shrink-0 border-t border-gold-line dark:border-midnight-line">
          <div class="flex items-baseline justify-between mb-3">
            <span class="font-semibold">{{ t("common.total") }}</span>
            <span class="text-[22px] font-semibold text-royal dark:text-night-price">
              {{ fmt(cartTotal) }} &#3647;
            </span>
          </div>
          <NuxtLink
            to="/cart"
            class="w-full h-[48px] rounded-full bg-gold dark:bg-night-price text-navy font-semibold flex items-center justify-center transition hover:brightness-105 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-periwinkle"
          >
            {{ t("cart.view") }}
          </NuxtLink>
        </div>
      </div>
      <EmptyCart v-else compact />
    </Transition>
  </div>
</template>

<style lang="postcss">
/* Cart item transitions */
.cart-item-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.cart-item-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 1, 1);
}

.cart-item-enter-from {
  opacity: 0;
  transform: translateX(-30px) scale(0.9);
}

.cart-item-leave-to {
  opacity: 0;
  transform: translateX(30px) scale(0.9);
}

.cart-item-move {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
