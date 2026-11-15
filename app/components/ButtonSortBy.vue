<script setup>
const router = useRouter();
const route = useRoute();

const options = [
  { value: "ASC", label: "ราคาน้อยไปมาก" },
  { value: "DESC", label: "ราคามากไปน้อย" },
];

const selectedSort = ref(
  route.query.orderby === "DESC" && route.query.fieldby === "PRICE"
    ? "DESC"
    : "ASC"
);

const selectedLabel = computed(
  () => options.find((o) => o.value === selectedSort.value)?.label
);

const setSort = (value) => {
  selectedSort.value = value;
  isDropdownVisible.value = false;
  router.push({ query: { ...route.query, orderby: value, fieldby: "PRICE" } });
};

const isDropdownVisible = ref(false);
const dropdownRef = ref(null);

onClickOutside(dropdownRef, () => (isDropdownVisible.value = false));
</script>

<template>
  <div class="relative select-none" ref="dropdownRef">
    <button
      type="button"
      class="filter-pill"
      :class="{ 'filter-pill--open': isDropdownVisible }"
      :aria-expanded="isDropdownVisible"
      aria-haspopup="listbox"
      @click="isDropdownVisible = !isDropdownVisible"
    >
      <UIcon name="i-iconamoon-sorting-left" size="18" aria-hidden="true" />
      <span>เรียง: {{ selectedLabel }}</span>
      <UIcon name="i-iconamoon-arrow-down-2" size="16" aria-hidden="true" />
    </button>
    <Transition name="dropdown">
      <ul
        v-if="isDropdownVisible"
        role="listbox"
        aria-label="เรียงตาม"
        class="filter-menu left-0"
      >
        <li v-for="option in options" :key="option.value">
          <button
            type="button"
            role="option"
            :aria-selected="selectedSort === option.value"
            class="filter-option"
            @click="setSort(option.value)"
          >
            <span>{{ option.label }}</span>
            <UIcon
              v-if="selectedSort === option.value"
              name="i-iconamoon-check-bold"
              size="18"
              class="text-royal dark:text-night-price"
            />
          </button>
        </li>
      </ul>
    </Transition>
  </div>
</template>

