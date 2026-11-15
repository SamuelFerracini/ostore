import pkg from "./package.json";
import storefrontConfig from "./storefront.config.js";

export default defineNuxtConfig({
  devtools: { enabled: false },

  modules: ["@vueuse/nuxt", "@nuxt/ui", "@nuxt/image"],

  future: { compatibilityVersion: 4 },

  app: {
    head: {
      link: [
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=IBM+Plex+Sans+Thai:wght@400;500;600&family=Noto+Serif+Thai:wght@500;600&display=swap",
        },
      ],
    },
  },

  // Dark text tones, plus a full 50-950 scale of the `royal` token so Nuxt UI can use it as `primary`.
  // Kept here (not in tailwind.config.ts) so the shared token block there stays identical across units.
  tailwindcss: {
    config: {
      theme: {
        extend: {
          colors: {
            // Dark-theme text tones from the design spec.
            night: {
              text: "#EEF2F8",
              muted: "#A4B1C8",
              gold: "#D8B868",
              price: "#B9CCEE",
            },
            "royal-blue": {
              50: "#EEF3FA",
              100: "#DCE5F4",
              200: "#B9CCEE",
              300: "#8FA9DC",
              400: "#5B7DB8",
              500: "#2B4C7E",
              600: "#24406B",
              700: "#1E3558",
              800: "#1D2B45",
              900: "#162036",
              950: "#0E1729",
            },
          },
        },
      },
    },
  },

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
