<script setup>
import websiteStore from "~~/stores/website";

const router = useRouter();
const route = useRoute();
const { t } = useLocale();
const { categoryPills } = useCategoryLabels();

const cardsSlider = ref(null);
const showPrev = ref(false);
const showNext = ref(true);
const isDragging = ref(false);
const dragThreshold = 10;
let startX, scrollLeft;

const setCategory = (category) => {
  if (!isDragging.value && !isActive(category)) {
    router.push({ query: { ...route.query, category } });
  }
};

// Localised pills, limited to the categories the selected shop has.
const pills = computed(() => {
  const ids = (websiteStore.getters.selectedShop.categories || []).map(
    (c) => c.id
  );
  return categoryPills.value.filter((pill) => pill.id === ALL_CATEGORY || ids.includes(pill.id));
});

const isActive = (id) =>
  resolveCategory(route.query, websiteStore.getters.selectedShop) === id;

const initializeDrag = (e) => {
  isDragging.value = false;
  startX = e.pageX - cardsSlider.value.getBoundingClientRect().left;
  scrollLeft = cardsSlider.value.scrollLeft;
  document.addEventListener("mousemove", handleDragging);
  document.addEventListener("mouseup", endDrag);
};

const handleDragging = (e) => {
  const xPos = e.pageX - cardsSlider.value.getBoundingClientRect().left;
  const walk = (xPos - startX) * 1.5;
  cardsSlider.value.scrollLeft = scrollLeft - walk;
  isDragging.value = Math.abs(walk) > dragThreshold;
};

const endDrag = () => {
  document.removeEventListener("mousemove", handleDragging);
  document.removeEventListener("mouseup", endDrag);
};

const updateButtonVisibility = () => {
  const { scrollLeft, scrollWidth, clientWidth } = cardsSlider.value;
  showPrev.value = scrollLeft > 16;
  showNext.value = scrollLeft < scrollWidth - clientWidth - 16;
};

onMounted(() => {
  cardsSlider.value.addEventListener("mousedown", initializeDrag);
  updateButtonVisibility();
});

onBeforeUnmount(() => {
  document.removeEventListener("mousemove", handleDragging);
  document.removeEventListener("mouseup", endDrag);
});
</script>

<template>
  <div class="slider-container">
    <div class="slider-wrapper">
      <div
        ref="cardsSlider"
        class="cards-slider"
        role="group"
        :aria-label="t('cat.categories')"
        @scroll="updateButtonVisibility"
      >
        <button
          v-for="pill in pills"
          :key="pill.id"
          type="button"
          @click="setCategory(pill.id)"
          :aria-current="isActive(pill.id) ? 'page' : undefined"
          :class="[
            'cat-pill',
            isActive(pill.id)
              ? 'cat-pill--active'
              : pill.sale
              ? 'cat-pill--sale'
              : 'cat-pill--idle',
          ]"
        >
          <UIcon
            v-if="pill.sale"
            name="i-iconamoon-discount"
            size="16"
            aria-hidden="true"
          />
          {{ pill.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="postcss">
img {
  @apply pointer-events-none;
}

.slider-container {
  @apply flex relative overflow-hidden items-center;
}

.slider-wrapper {
  @apply relative w-full overflow-hidden;
}

.cards-slider {
  @apply flex cursor-grab w-full overflow-x-auto gap-2 px-4 lg:px-8 py-0.5;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.cards-slider::-webkit-scrollbar {
  display: none;
}

.cards-slider:active {
  cursor: grabbing;
}

.cat-pill {
  @apply inline-flex shrink-0 items-center gap-1.5 min-h-[44px] px-4 rounded-full border text-[15px] font-medium whitespace-nowrap select-none transition active:scale-95;
}

.cat-pill--idle {
  @apply bg-white border-sky text-navy hover:border-periwinkle dark:bg-midnight dark:border-midnight-line dark:text-night-text dark:hover:border-periwinkle;
}

.cat-pill--active {
  @apply bg-navy border-navy text-white dark:bg-night-text dark:border-night-text dark:text-midnight;
}

.cat-pill--sale {
  @apply bg-gold-soft border-gold-line text-gold-text hover:border-gold dark:bg-gold/10 dark:border-gold/40 dark:text-night-gold;
}
</style>
