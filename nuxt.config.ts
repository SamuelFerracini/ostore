import pkg from "./package.json";
import storefrontConfig from "./storefront.config.js";
import { buildProductIndex } from "./scripts/build-product-index.mjs";

export default defineNuxtConfig({
  devtools: { enabled: false },

  modules: ["@vueuse/nuxt", "@nuxt/ui", "@nuxt/image"],

  // The app loads public/products-index.json and public/products-detail/,
  // generated from the scraped public/products.json. Build them on every
  // dev, build and generate, so a plain `nuxt dev` works too.
  hooks: {
    "build:before": () => buildProductIndex(),
  },

  // Follow the OS on first visit; the footer toggle stores an explicit choice.
  colorMode: { preference: "system", fallback: "light" },

  future: { compatibilityVersion: 4 },

  app: {
    head: {
      link: [
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
        { rel: "icon", href: "/favicon.ico", sizes: "any" },
        { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
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
              text: "#F6E7EB",
              muted: "#C29AA6",
              gold: "#C9A06A",
              price: "#E8A3B4",
            },
            "royal-blue": {
              50: "#FDF1F3",
              100: "#FBE8EC",
              200: "#F2D5DC",
              300: "#E8A3B4",
              400: "#D17A93",
              500: "#B5546E",
              600: "#9C4560",
              700: "#823850",
              800: "#5E2A3A",
              900: "#3A2A31",
              950: "#1E161A",
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
      adminPasswordHash: storefrontConfig.adminPasswordHash,
      public: {
        NUXT_API_URL: process.env.NUXT_API_URL,
      },
    },
  },

  compatibilityDate: "2024-08-03",
});
