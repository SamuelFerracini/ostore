<script setup>
import { ref, computed, onMounted } from "vue";

// Constants for logo IDs (Example)
const GNOCE = { id: "gnoce" };
const PANDORA = { id: "pandora" };

const logo = computed(() => {
  return {
    [GNOCE.id]: () => import("./GnoceLogo.vue"),
    [PANDORA.id]: () => import("./PandoraLogo.vue"),
  };
});

const props = defineProps({
  shop: String,
});

const currentLogoId = ref(props.shop); // Just for example; replace with actual logic

const logoComponent = ref(null);

onMounted(async () => {
  // Dynamically import the component based on the currentLogoId
  logoComponent.value = (await logo.value[currentLogoId.value]()).default;
});
</script>

<template>
  <component :is="logoComponent" />
</template>
