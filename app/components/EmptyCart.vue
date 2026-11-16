<script setup>
defineProps({
  compact: { type: Boolean, default: false },
});

const { t } = useLocale();

const categories = computed(() => [
  { label: t("empty.rings"), to: "/products?q=ring" },
  { label: t("empty.charms"), to: "/products?q=charm" },
  { label: t("empty.sale"), to: "/products?category=all-sale" },
]);
</script>

<template>
  <div
    v-if="!compact"
    class="flex min-h-[50vh] flex-col items-center justify-center px-5 pb-16 text-center"
  >
    <div
      class="flex h-24 w-24 items-center justify-center rounded-full bg-mist dark:bg-midnight-surface"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 160 160"
        class="h-14 w-14"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path
          d="M44 34c0-5 4-8 9-8h10c5 0 8 3 8 8v30c0 8 5 14 13 18l30 14c10 5 16 12 16 22v6c0 4-3 7-7 7H46c-4 0-7-3-7-7V34z"
          class="stroke-navy dark:stroke-night-text"
          stroke-width="5"
        />
        <path
          d="M39 120h98"
          class="stroke-gold dark:stroke-night-gold"
          stroke-width="5"
        />
        <path
          d="M50 40c0 22 6 34 20 44"
          class="stroke-periwinkle"
          stroke-width="4"
        />
        <path d="M95 96l14 6M100 108l14 6" class="stroke-periwinkle" stroke-width="4" />
        <path
          d="M118 62l2.5 6.5 6.5 2.5-6.5 2.5-2.5 6.5-2.5-6.5-6.5-2.5 6.5-2.5z"
          class="fill-gold dark:fill-night-gold stroke-none"
        />
        <path
          d="M30 66l1.8 4.7 4.7 1.8-4.7 1.8L30 79l-1.8-4.7-4.7-1.8 4.7-1.8z"
          class="fill-periwinkle stroke-none"
        />
      </svg>
    </div>
    <p
      class="mt-6 font-display-th text-2xl font-semibold text-navy dark:text-night-text"
    >
      {{ t("empty.cartTitle") }}
    </p>
    <p class="mt-2 text-[15px] text-muted dark:text-night-muted">
      {{ t("empty.cartSub") }}
    </p>
    <NuxtLink
      to="/products"
      class="mt-6 inline-flex min-h-[46px] items-center rounded-full bg-gold px-6 text-[15px] font-semibold text-navy hover:bg-gold-light transition"
    >
      {{ t("common.shopNow") }}
    </NuxtLink>
  </div>

  <div
    v-else
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
      {{ t("empty.cartTitle") }}
    </h2>
    <p class="text-muted dark:text-[#B7C3D9] leading-relaxed mb-6">
      {{ t("empty.cartSubLong") }}<br />
      {{ t("empty.cartSub") }}
    </p>

    <NuxtLink
      to="/products"
      class="inline-flex items-center justify-center min-h-[48px] px-8 rounded-full bg-gold dark:bg-[#D8B868] text-navy font-semibold transition hover:brightness-105 active:scale-95 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-periwinkle"
    >
      {{ t("common.shopNow") }}
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
