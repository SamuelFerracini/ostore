<script setup>
defineProps({
  compact: { type: Boolean, default: false },
});

const categories = [
  { label: "แหวน", to: "/products?q=ring" },
  { label: "ชาร์ม", to: "/products?q=charm" },
  { label: "ลดราคา", to: "/products?category=all-sale" },
];
</script>

<template>
  <div
    :class="[
      'flex flex-col items-center text-center text-navy dark:text-[#EEF2F8]',
      compact ? 'w-[calc(100vw-24px)] sm:w-96 px-5 py-8' : 'px-4 py-12 md:py-20',
    ]"
  >
    <div
      :class="[
        'relative rounded-full bg-mist dark:bg-midnight-surface flex items-center justify-center',
        compact ? 'w-36 h-36' : 'w-[220px] h-[220px]',
      ]"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 160 160"
        :class="compact ? 'w-28 h-28' : 'w-40 h-40'"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <!-- glass slipper line art -->
        <path
          d="M44 34c0-5 4-8 9-8h10c5 0 8 3 8 8v30c0 8 5 14 13 18l30 14c10 5 16 12 16 22v6c0 4-3 7-7 7H46c-4 0-7-3-7-7V34z"
          class="stroke-navy dark:stroke-[#EEF2F8]"
          stroke-width="3.5"
        />
        <path
          d="M39 120h98"
          class="stroke-gold dark:stroke-[#D8B868]"
          stroke-width="3.5"
        />
        <path
          d="M50 40c0 22 6 34 20 44"
          class="stroke-periwinkle"
          stroke-width="3"
        />
        <path d="M95 96l14 6M100 108l14 6" class="stroke-periwinkle" stroke-width="3" />
        <path
          d="M118 62l2.5 6.5 6.5 2.5-6.5 2.5-2.5 6.5-2.5-6.5-6.5-2.5 6.5-2.5z"
          class="fill-gold dark:fill-[#D8B868] stroke-none"
        />
        <path
          d="M30 66l1.8 4.7 4.7 1.8-4.7 1.8L30 79l-1.8-4.7-4.7-1.8 4.7-1.8z"
          class="fill-periwinkle stroke-none"
        />
      </svg>
    </div>

    <h2
      :class="[
        'font-display-th font-semibold mt-7 mb-2',
        compact ? 'text-xl' : 'text-[28px]',
      ]"
    >
      ตะกร้ายังว่างอยู่
    </h2>
    <p class="text-muted dark:text-[#B7C3D9] leading-relaxed mb-6">
      ยังมีเวลาก่อนเที่ยงคืน<br />
      มาหาชิ้นที่ใช่กันเถอะ
    </p>

    <NuxtLink
      to="/products"
      class="inline-flex items-center justify-center min-h-[48px] px-8 rounded-full bg-gold dark:bg-[#D8B868] text-navy font-semibold transition hover:brightness-105 active:scale-95 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-periwinkle"
    >
      เลือกซื้อสินค้า
    </NuxtLink>

    <div class="flex flex-wrap justify-center gap-2 mt-6">
      <NuxtLink
        v-for="c in categories"
        :key="c.label"
        :to="c.to"
        class="inline-flex items-center min-h-[44px] px-5 rounded-full border border-sky dark:border-midnight-line bg-white dark:bg-midnight-surface text-royal dark:text-[#EEF2F8] text-sm font-medium transition hover:bg-mist dark:hover:bg-midnight-line focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-periwinkle"
      >
        {{ c.label }}
      </NuxtLink>
    </div>
  </div>
</template>
