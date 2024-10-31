import pkg from "./package.json";

export default defineNuxtConfig({
  devtools: { enabled: false },

  modules: ["@vueuse/nuxt", "@nuxt/ui", "@nuxt/image", "@pinia/nuxt"],

  build: {
    transpile: ["pinia"],
  },

  future: { compatibilityVersion: 4 },

  runtimeConfig: {
    public: {
      version: pkg.version,
    },
  },

  compatibilityDate: "2024-08-03",
});
