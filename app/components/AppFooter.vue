<script setup>
import websiteStore from "~~/stores/website";

const colorMode = useColorMode();

const toggleDark = () => {
  colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
};

const colorModeIcon = computed(() =>
  colorMode.value === "dark"
    ? "i-iconamoon-mode-dark-fill"
    : "i-iconamoon-mode-light-fill"
);

const colorModeLabel = computed(() =>
  colorMode.value === "dark" ? "เปลี่ยนเป็นโหมดสว่าง" : "เปลี่ยนเป็นโหมดมืด"
);

const facebookUrl = "https://www.facebook.com/nonlapan.ssw";
const shopId = computed(() => websiteStore.getters.selectedShop.id);
</script>

<template>
  <!-- Desktop footer -->
  <footer
    class="max-lg:hidden mt-16 bg-navy text-white border-t-4 border-gold dark:border-t dark:border-midnight-line"
  >
    <div
      class="mx-auto flex max-w-[1440px] flex-wrap items-center gap-x-12 gap-y-6 px-8 py-10"
    >
      <div class="footer-brand">
        <p class="font-display text-[30px] font-semibold leading-none">
          Pandora
          <em class="font-medium text-gold-light">with Nonlapan</em>
        </p>
        <div
          v-if="shopId === 'pandora'"
          class="mt-4 flex flex-col gap-1 text-[15px] leading-relaxed text-white/80"
        >
          <p>ช็อปออสเตรเลีย ราคารวมทุกอย่างพร้อมกล่องและถุง 💖</p>
          <p>
            อาจเปลี่ยนแปลงตามโปรช่วงนั้นนะคะ ถ้าต้องการใบเสร็จทักสอบถามได้นะคะ 🙏🏼
          </p>
        </div>
        <div
          v-if="shopId === 'gnoce'"
          class="mt-4 text-[15px] leading-relaxed text-white/80"
        >
          <p>สินค้าส่งตรงถึงบ้าน ไม่ต้อองจ่ายภาษีและค่าส่งเพิ่มนะคะ</p>
        </div>
      </div>

      <div class="footer-actions">
        <NuxtLink
          to="/tracking"
          class="inline-flex min-h-[44px] items-center gap-2 rounded-full px-3 text-[15px] font-medium text-white/90 underline-offset-4 hover:text-white hover:underline"
        >
          <UIcon name="i-iconamoon-delivery-light" size="20" aria-hidden="true" />
          ติดตามคำสั่งซื้อ
        </NuxtLink>
        <button
          type="button"
          @click="toggleDark"
          class="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white/90 hover:border-gold-light hover:text-gold-light transition active:scale-95"
          :aria-label="colorModeLabel"
        >
          <ClientOnly><UIcon :name="colorModeIcon" size="20" /></ClientOnly>
        </button>
        <a
          :href="facebookUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex min-h-[48px] items-center gap-3 rounded-full border border-gold pl-1.5 pr-5 text-[15px] font-medium text-gold-light hover:bg-gold/10 transition active:scale-95"
        >
          <span
            class="flex h-9 w-9 items-center justify-center rounded-full bg-gold text-navy"
            aria-hidden="true"
          >
            <svg viewBox="0 0 24 24" class="h-5 w-5" fill="currentColor">
              <path
                d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.6-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H8v3h2.5V21h3Z"
              />
            </svg>
          </span>
          ทักแชท Facebook
        </a>
      </div>
    </div>
  </footer>

  <!-- Phone bar -->
  <div
    class="lg:hidden fixed inset-x-0 bottom-0 z-40 flex items-center gap-2 bg-navy text-white border-t-2 border-gold px-4 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] dark:border-t dark:border-midnight-line"
    :class="shopId === 'pandora' || shopId === 'gnoce' ? 'justify-between' : 'justify-end'"
  >
    <div
      v-if="shopId === 'pandora'"
      class="flex min-w-0 flex-1 flex-col gap-0.5 text-[12px] leading-snug text-white/85"
    >
      <p>ช็อปออสเตรเลีย ราคารวมทุกอย่างพร้อมกล่องและถุง 💖</p>
      <p>
        อาจเปลี่ยนแปลงตามโปรช่วงนั้นนะคะ ถ้าต้องการใบเสร็จทักสอบถามได้นะคะ 🙏🏼
      </p>
    </div>
    <div
      v-if="shopId === 'gnoce'"
      class="flex min-w-0 flex-1 flex-col text-[12px] leading-snug text-white/85"
    >
      <p>สินค้าส่งตรงถึงบ้าน ไม่ต้อองจ่ายภาษีและค่าส่งเพิ่มนะคะ</p>
    </div>
    <button
      type="button"
      @click="toggleDark"
      class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/25 text-white/90 active:scale-95 transition"
      :aria-label="colorModeLabel"
    >
      <ClientOnly><UIcon :name="colorModeIcon" size="20" /></ClientOnly>
    </button>
    <a
      :href="facebookUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold text-navy shadow-[0_0_0_3px_rgba(226,199,131,0.25)] active:scale-95 transition"
      aria-label="ทักแชท Facebook"
    >
      <svg viewBox="0 0 24 24" class="h-6 w-6" fill="currentColor" aria-hidden="true">
        <path
          d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.6-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H8v3h2.5V21h3Z"
        />
      </svg>
    </a>
  </div>
</template>

<style scoped>
.footer-brand {
  flex: 1 1 420px;
  min-width: 0;
}
.footer-actions {
  flex: none;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
}
</style>
