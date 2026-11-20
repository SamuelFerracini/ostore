<script setup>
// Admin login. Not guarded by the admin middleware.
const { t } = useLocale();
const { isAdmin, login, exit } = useAdmin();
const hash = useRuntimeConfig().public.adminPasswordHash;

useHead({
  title: () => t("admin.login.title"),
  meta: [{ name: "robots", content: "noindex, nofollow" }],
});

const password = ref("");
const failed = ref(false);

const submit = async () => {
  failed.value = false;
  if (!login(password.value)) {
    failed.value = true;
    return;
  }
  password.value = "";
  await navigateTo("/products");
};
</script>

<template>
  <div class="mx-auto flex min-h-[60vh] max-w-[420px] flex-col justify-center px-4 py-10">
    <h1
      class="font-display-th text-[26px] font-semibold leading-tight text-navy dark:text-night-text lg:text-[34px]"
    >
      {{ t("admin.login.title") }}
    </h1>

    <div v-if="isAdmin" class="mt-5 flex flex-col gap-3">
      <p class="text-[15px] text-muted dark:text-night-muted">
        {{ t("admin.login.on") }}
      </p>
      <NuxtLink
        to="/products"
        class="inline-flex min-h-[46px] items-center justify-center rounded-full bg-gold px-6 text-[15px] font-semibold text-navy transition hover:bg-gold-light"
      >
        {{ t("admin.login.products") }}
      </NuxtLink>
      <button
        type="button"
        class="inline-flex min-h-[46px] items-center justify-center rounded-full border border-gold-line px-6 text-[15px] font-semibold text-navy transition hover:bg-gold-soft dark:border-gold/30 dark:text-night-text dark:hover:bg-gold/10"
        @click="exit"
      >
        {{ t("admin.exit") }}
      </button>
    </div>

    <p v-else-if="!hash" class="mt-5 text-[15px] text-muted dark:text-night-muted">
      {{ t("admin.login.disabled") }}
    </p>

    <form v-else class="mt-5 flex flex-col gap-3" @submit.prevent="submit">
      <label class="sr-only" for="admin-password">{{ t("admin.login.password") }}</label>
      <UInput
        id="admin-password"
        v-model="password"
        type="password"
        size="lg"
        autocomplete="current-password"
        :placeholder="t('admin.login.password')"
        :color="failed ? 'red' : undefined"
        @input="failed = false"
      />
      <p v-if="failed" role="alert" class="text-sm font-medium text-red-600 dark:text-red-400">
        {{ t("admin.login.error") }}
      </p>
      <button
        type="submit"
        class="inline-flex min-h-[46px] items-center justify-center rounded-full bg-gold px-6 text-[15px] font-semibold text-navy transition hover:bg-gold-light"
      >
        {{ t("admin.login.submit") }}
      </button>
    </form>
  </div>
</template>
