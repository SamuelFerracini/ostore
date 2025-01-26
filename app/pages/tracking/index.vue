<script setup>
const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();
import axios from "axios";

const trackingReference = ref(route.query.ref);
const loading = ref(false);

const trackingReponse = ref(null);
const errorMessage = ref(null);

const logos = {
  auspost:
    "https://yt3.googleusercontent.com/Cx65gC_Uy6ie2ojgj2Oyf53yeXBbSRtYWcTzN57uQH0Lfok3RJBoX9Le3S3u5Hbrq6rkZWpYGg=s900-c-k-c0x00ffffff-no-rj",
  jtexpress:
    "https://cdn.shopify.com/app-store/listing_images/e10e0e259430f62e17b1d2813fc0d35c/icon/CLy2tN70lu8CEAE=.jpg",
};

const search = async () => {
  if (!trackingReference.value) {
    return;
  }

  loading.value = true;

  try {
    errorMessage.value = null;
    const baseUrl = config.public.public.NUXT_API_URL;

    const response = await axios.get(
      `${baseUrl}/trackings/${trackingReference.value}`
    );

    trackingReponse.value = response.data;
  } catch (err) {
    errorMessage.value =
      err.response?.statusText ?? "Oops, something went wrong!";
  }

  loading.value = false;
};

const reflect = () => {
  router.push({
    query: {
      ref: trackingReference.value ? trackingReference.value : undefined,
    },
  });
};

import dayjs from "dayjs";

const formatDate = (date, formatStr = "MMM DD, YYYY hh:mm A") => {
  if (!date) return "";
  return dayjs(date).format(formatStr);
};

onMounted(() => {
  search();
});
</script>
<template>
  <div class="flex flex-col items-center justify-center">
    <div class="md:w-1/3 w-full p-10">
      <div
        class="flex flex-shrink flex-grow flex-col text-sm font-semibold text-[#111] dark:text-[#eee] mr-2"
      >
        <form
          @submit.prevent="search"
          class="flex h-12 flex-grow rounded-full pl-4 pr-3 transition-all hover:bg-black/10 hover:dark:bg-white/20 bg-black/5 dark:bg-white/15"
        >
          <div class="flex w-full items-center gap-4">
            <div class="flex w-full items-center">
              <input
                v-model="trackingReference"
                class="w-full bg-transparent py-2 outline-none placeholder:text-[#757575] placeholder:dark:text-neutral-400"
                type="text"
                @input="reflect"
                placeholder="Tracking number"
              />
              <button
                type="submit"
                class="flex text-neutral-500 dark:text-neutral-400"
              >
                <UIcon name="i-iconamoon-search-bold" size="20" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
    <div
      v-if="trackingReponse?.success && !errorMessage"
      class="flex flex-col items-center gap-3"
    >
      <p>Last Update at: {{ formatDate(trackingReponse.data.updated_at) }}</p>
      <div v-for="(tracking, idx) in trackingReponse.data.orders" :key="idx">
        <div class="flex justify-end mb-3">
          <img class="w-10" :src="logos[tracking.courier]" />
        </div>
        <div class="card">
          <Timeline :value="tracking.events">
            <template #opposite="slotProps">
              <small class="text-surface-500 dark:text-surface-400">
                {{ formatDate(slotProps.item.date) }}
              </small>
            </template>
            <template #content="slotProps">
              <div>
                <p>
                  {{ slotProps.item.description }}
                </p>
                <p>
                  {{ slotProps.item.location }}
                </p>
              </div>
            </template>
          </Timeline>
        </div>
      </div>
    </div>
    <p class="text-red-500">{{ errorMessage }}</p>
  </div>
</template>
