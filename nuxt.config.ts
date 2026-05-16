import pkg from "./package.json";
import storefrontConfig from "./storefront.config.js";

import Aura from "@primevue/themes/aura";

export default defineNuxtConfig({
  devtools: { enabled: false },

  modules: ["@vueuse/nuxt", "@nuxt/ui", "@nuxt/image", "@primevue/nuxt-module"],

  primevue: {
    options: {
      theme: {
        preset: Aura,
      },
    },
  },

  future: { compatibilityVersion: 4 },

  runtimeConfig: {
    public: {
      version: pkg.version,
      promotionsPaused: storefrontConfig.promotionsPaused,
      public: {
        NUXT_API_URL: process.env.NUXT_API_URL,
      },
    },
  },

  compatibilityDate: "2024-08-03",
});
