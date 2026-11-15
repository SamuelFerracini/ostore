<template>
  <div v-for="i in 12" :key="i" class="flex flex-col" aria-hidden="true">
    <div class="skeleton-arch">
      <div class="skeleton-arch__photo skeleton"></div>
    </div>
    <div class="grid gap-2 pt-3.5 px-1">
      <div class="h-5 w-4/5 rounded-full bg-mist dark:bg-midnight-surface skeleton"></div>
      <div class="h-4 w-1/3 rounded-full bg-mist/80 dark:bg-midnight-surface/80 skeleton"></div>
      <div class="h-3.5 w-1/4 rounded-full bg-gold-soft dark:bg-midnight-surface/60 skeleton"></div>
      <div class="mt-2 h-[46px] w-full rounded-full bg-mist/70 dark:bg-midnight-surface skeleton"></div>
    </div>
  </div>
</template>

<style lang="postcss">
.dark .skeleton {
  --skeleton-bg: rgba(255, 255, 255, 0.06);
}

.skeleton {
  --skeleton-bg: rgba(255, 255, 255, 0.7);
}

.skeleton {
  @apply relative overflow-hidden;
  &:before {
    @apply absolute w-full h-full;
    content: '';
    background: linear-gradient(110deg, rgba(0, 0, 0, 0) 25%, var(--skeleton-bg) 50%, rgba(0, 0, 0, 0) 75%);
    background-size: 400% 100%;
    animation: shimmer 4s infinite linear;
  }
}

.skeleton-arch {
  @apply bg-white border border-gold-arch dark:bg-midnight-surface dark:border-midnight-line;
  padding: 6px;
  border-radius: 50% 50% 18px 18px / 26% 26% 18px 18px;
}

.skeleton-arch__photo {
  @apply bg-photo dark:bg-midnight;
  aspect-ratio: 3 / 4;
  border-radius: 50% 50% 14px 14px / 25% 25% 14px 14px;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
