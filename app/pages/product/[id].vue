<script setup>
import { getProductById } from "~/composables/store.js";

// Legacy /product/<slug>-<id> links. The product view is the modal on
// /products (?product=<id>), which loads its detail on demand, so resolve the
// id against the product index and hand over to it. Unknown ids land on
// /products.
const route = useRoute();

// The id is the last dash-separated part; try longer suffixes too, in case
// an id ever contains a dash.
const candidates = (param) => {
  const parts = String(param || "").split("-").filter(Boolean);
  const out = [];
  for (let i = parts.length - 1; i >= 0; i--) out.push(parts.slice(i).join("-"));
  return out;
};

onMounted(async () => {
  let id = null;
  try {
    for (const candidate of candidates(route.params.id)) {
      if (await getProductById(candidate)) {
        id = candidate;
        break;
      }
    }
  } catch {
    /* index failed to load: fall through to the product list */
  }
  await navigateTo(
    { path: "/products", query: id ? { product: id } : {} },
    { replace: true },
  );
});
</script>

<template>
  <ProductSkeleton />
</template>
