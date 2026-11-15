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
  <div class="mx-auto flex max-w-2xl flex-col items-center px-4 pt-8 pb-12 lg:pt-12">
    <h1
      class="font-display-th text-[26px] lg:text-[34px] font-semibold text-navy dark:text-night-text"
    >
      ติดตามคำสั่งซื้อ
    </h1>
    <p class="mt-1 text-[15px] text-muted dark:text-night-muted">
      ใส่เลขพัสดุที่ได้รับทางแชท
    </p>
    <form
      @submit.prevent="search"
      class="mt-6 flex h-12 w-full max-w-md items-center rounded-full border border-sky bg-field pl-5 pr-1 transition-colors focus-within:border-periwinkle dark:border-midnight-line dark:bg-midnight-surface"
    >
      <label for="tracking-ref" class="sr-only">เลขพัสดุ</label>
      <input
        id="tracking-ref"
        v-model="trackingReference"
        class="w-full min-w-0 bg-transparent py-2 text-[15px] text-navy outline-none focus-visible:outline-none placeholder:text-muted dark:text-night-text placeholder:dark:text-night-muted"
        type="text"
        @input="reflect"
        placeholder="เลขพัสดุ"
      />
      <button
        type="submit"
        class="flex h-10 min-w-[44px] shrink-0 items-center justify-center gap-1.5 rounded-full bg-royal px-4 text-sm font-medium text-white hover:bg-royal-blue-600 transition"
        aria-label="ค้นหาเลขพัสดุ"
      >
        <UIcon v-if="!loading" name="i-iconamoon-search-bold" size="18" />
        <UIcon v-else name="i-svg-spinners-90-ring-with-bg" size="18" />
      </button>
    </form>

    <p
      v-if="errorMessage"
      role="alert"
      class="mt-6 flex items-center gap-2 rounded-2xl border border-gold-line bg-gold-soft px-4 py-3 text-[15px] text-navy dark:border-gold/30 dark:bg-gold/10 dark:text-night-text"
    >
      <UIcon name="i-iconamoon-information-circle" size="20" class="shrink-0 text-gold-text dark:text-night-gold" />
      ไม่พบข้อมูลพัสดุ ({{ errorMessage }}) ลองตรวจเลขพัสดุอีกครั้ง หรือทักแชทสอบถาม
    </p>

    <div
      v-if="trackingReponse?.success && !errorMessage"
      class="mt-8 flex w-full flex-col items-center gap-4"
    >
      <p class="text-[15px] text-muted dark:text-night-muted">
        อัปเดตล่าสุด: {{ formatDate(trackingReponse.data.updated_at) }}
      </p>
      <div
        v-for="(tracking, idx) in trackingReponse.data.orders"
        :key="idx"
        class="w-full rounded-3xl border border-gold-line bg-white p-5 dark:border-midnight-line dark:bg-midnight-surface"
      >
        <div class="mb-3 flex justify-end">
          <img class="w-10 rounded-lg" :src="logos[tracking.courier]" :alt="tracking.courier" />
        </div>
        <Timeline :value="tracking.events">
          <template #opposite="slotProps">
            <small class="text-muted dark:text-night-muted">
              {{ formatDate(slotProps.item.date) }}
            </small>
          </template>
          <template #content="slotProps">
            <div class="text-navy dark:text-night-text">
              <p>
                {{ slotProps.item.description }}
              </p>
              <p class="text-muted dark:text-night-muted">
                {{ slotProps.item.location }}
              </p>
            </div>
          </template>
        </Timeline>
      </div>
    </div>
  </div>
</template>
