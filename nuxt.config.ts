import pkg from "./package.json";

export default defineNuxtConfig({
  devtools: { enabled: false },

  modules: ["@vueuse/nuxt", "@nuxt/ui", "@nuxt/image"],

  future: { compatibilityVersion: 4 },

  runtimeConfig: {
    public: {
      version: pkg.version,
    },
  },

  compatibilityDate: "2024-08-03",
});
