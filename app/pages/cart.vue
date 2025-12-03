<script setup>
import cartStore from "~~/stores/cart";

const cartItems = computed(() => cartStore.getters.cartItems);
const cartCount = computed(() => cartStore.getters.cartCount);
const cartTotal = computed(() => cartStore.getters.cartTotal);
const copied = ref(false);

const updateQuantity = (productId, quantity) => {
  cartStore.dispatch("updateQuantity", { productId, quantity });
};

const removeFromCart = (productId) => {
  cartStore.dispatch("removeFromCart", productId);
};

const clearCart = () => {
  if (confirm("Are you sure you want to clear the cart?")) {
    cartStore.dispatch("clearCart");
  }
};

const copyToClipboard = async () => {
  const baseUrl = window.location.origin;

  // Format cart items
  let text = "";

  cartItems.value.forEach((item, index) => {
    text += `${index + 1}. ${item.name}\n`;
    text += `   Price: ${item.price_normalised} THB`;
    text += `   Quantity: ${item.quantity}\n`;
    text += `   Subtotal: ${
      Number(item.price_normalised) * item.quantity
    } THB\n`;
    if (item.category) {
      text += `   Category: ${getCategoryName(item.category)}\n`;
    }
    text += `   Link: ${baseUrl}/products?q=${encodeURIComponent(item.name)}\n`;
    text += `\n`;
  });

  text += `Total Items: ${cartCount.value}\n`;
  text += `Total Amount: ${cartTotal.value} THB\n`;

  try {
    await navigator.clipboard.writeText(text);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    console.error("Failed to copy:", err);
    alert("Failed to copy to clipboard");
  }
};
</script>

<template>
  <div class="max-w-screen-xl mx-auto p-3 lg:p-5">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl font-bold text-black dark:text-white">Shopping Cart</h1>
      <div class="text-lg font-semibold text-[#5f5f5f] dark:text-[#b7b7b7]">
        {{ cartCount }} {{ cartCount === 1 ? "item" : "items" }}
      </div>
    </div>

    <!-- Empty Cart -->
    <div
      v-if="!cartItems.length"
      class="flex flex-col items-center justify-center py-20"
    >
      <div
        class="w-24 h-24 bg-black/10 dark:bg-white/20 rounded-full flex items-center justify-center mb-6"
      >
        <UIcon
          name="i-iconamoon-shopping-bag-bold"
          class="text-[#5f5f5f] dark:text-[#b7b7b7]"
          size="48"
        />
      </div>
      <h2 class="text-2xl font-bold mb-4 text-black dark:text-white">Your cart is empty</h2>
      <p class="text-[#5f5f5f] dark:text-[#b7b7b7] mb-8">
        Add some products to get started
      </p>
      <NuxtLink
        to="/products"
        class="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-semibold transition active:scale-95"
      >
        Continue Shopping
      </NuxtLink>
    </div>

    <!-- Cart Items -->
    <div v-else class="grid lg:grid-cols-3 gap-6">
      <!-- Items List -->
      <div class="lg:col-span-2 space-y-4">
        <div
          v-for="item in cartItems"
          :key="item.id"
          class="flex gap-4 bg-white dark:bg-neutral-900 p-4 rounded-2xl shadow-sm border border-black/5 dark:border-white/10"
        >
          <!-- Product Image -->
          <div class="w-24 h-28 flex-shrink-0">
            <NuxtImg
              :src="item.primaryImage"
              :alt="item.name"
              class="w-full h-full object-cover rounded-xl bg-neutral-200 dark:bg-neutral-800"
            />
          </div>

          <!-- Product Details -->
          <div class="flex-1 flex flex-col justify-between">
            <div>
              <h3 class="font-semibold text-base line-clamp-2 mb-1 text-black dark:text-white">
                {{ item.name }}
              </h3>
              <div class="flex items-center gap-2 mb-2">
                <div class="flex flex-col gap-1">
                  <p class="text-lg text-black dark:text-white">{{ item.price_normalised }} THB</p>
                  <div
                    v-if="
                      item.originalPrice_normalised &&
                      item.price_normalised !== item.originalPrice_normalised
                    "
                    class="text-[#5f5f5f] dark:text-[#a3a3a3] line-through"
                    v-html="`${item.originalPrice_normalised} THB`"
                  ></div>
                </div>
              </div>
              <div
                v-if="item.category"
                class="text-xs text-[#5f5f5f] dark:text-[#a3a3a3]"
              >
                {{ getCategoryName(item.category) }}
              </div>
            </div>

            <!-- Quantity Controls -->
            <div class="flex items-center justify-between mt-2">
              <div class="flex items-center gap-2">
                <button
                  @click="updateQuantity(item.id, item.quantity - 1)"
                  class="w-8 h-8 flex items-center justify-center rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 hover:dark:bg-white/15 transition active:scale-95 text-black dark:text-white"
                  :disabled="item.quantity <= 1"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M5 12h14"
                    />
                  </svg>
                </button>
                <span class="w-8 text-center font-semibold text-black dark:text-white">{{
                  item.quantity
                }}</span>
                <button
                  @click="updateQuantity(item.id, item.quantity + 1)"
                  class="w-8 h-8 flex items-center justify-center rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 hover:dark:bg-white/15 transition active:scale-95 text-black dark:text-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 5v14m7-7H5"
                    />
                  </svg>
                </button>
              </div>

              <button
                @click="removeFromCart(item.id)"
                class="text-red-600 hover:text-red-700 transition"
              >
                <UIcon name="i-iconamoon-trash-bold" size="20" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Cart Summary -->
      <div class="lg:col-span-1">
        <div
          class="bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow-sm border border-black/5 dark:border-white/10 sticky top-24"
        >
          <h2 class="text-xl font-bold mb-4 text-black dark:text-white">Order Summary</h2>

          <div class="space-y-3 mb-6">
            <!-- <div class="flex justify-between text-sm">
              <span class="text-[#5f5f5f] dark:text-[#b7b7b7]">Subtotal</span>
              <span class="font-semibold">${{ cartTotal.toFixed(2) }}</span>
            </div> -->
            <!-- <div class="flex justify-between text-sm">
              <span class="text-[#5f5f5f] dark:text-[#b7b7b7]">Shipping</span>
              <span class="font-semibold">Calculated at checkout</span>
            </div> -->
            <div class="border-t border-black/10 dark:border-white/10 pt-3">
              <div class="flex justify-between text-lg font-bold text-black dark:text-white">
                <span>Total</span>
                <span>{{ cartTotal }} THB</span>
              </div>
            </div>
          </div>

          <button
            @click="copyToClipboard"
            class="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-semibold transition active:scale-95 mb-3 flex items-center justify-center gap-2"
          >
            <UIcon
              :name="
                copied ? 'i-iconamoon-check-bold' : 'i-iconamoon-copy-bold'
              "
              size="20"
            />
            {{ copied ? "Copied!" : "Copy to Clipboard" }}
          </button>

          <button
            @click="clearCart"
            class="w-full py-3 bg-black/5 dark:bg-white/10 hover:bg-black/10 hover:dark:bg-white/15 rounded-full font-semibold transition active:scale-95 text-black dark:text-white"
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
