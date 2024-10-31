import { ref, computed } from "vue";

export const useWebsiteStore = defineStore("websiteStore", () => {
  const PANDORA = {
    id: "pandora",
    name: "Pandora",
    categories: [
      {
        id: "charms",
        name: "Charms",
      },
      {
        id: "rings",
        name: "Rings",
      },
      {
        id: "charms-and-bracelets",
        name: "Charms and Bracelets",
      },
    ],
  };

  const GNOCE = {
    id: "gnoce",
    name: "Gnoce",
    categories: [
      {
        id: "charms",
        name: "Charms",
      },
      {
        id: "bracelets",
        name: "Bracelets",
      },
      {
        id: "earrings",
        name: "Earrings",
      },
    ],
  };

  const shops = [PANDORA, GNOCE];

  const selectedShop = ref<Object>(PANDORA);

  const selectShop = (shop: object) => {
    selectedShop.value = shop;
  };

  return {
    selectedShop,
    selectShop,
    shops,
  };
});
