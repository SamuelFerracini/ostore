import { createStore } from "vuex";

export const PANDORA = {
  id: "pandora",
  name: "Pandora",
  logo: "https://cdn.worldvectorlogo.com/logos/pandora-logo.svg",
  categories: [
    { id: "promotions", name: "Promotions" },
    { id: "charm", name: "Charms" },
    { id: "bracelets", name: "Bracelets" },
    { id: "necklaces", name: "Necklaces" },
    { id: "rings", name: "Rings" },
    { id: "earrings", name: "Earrings" },
  ],
};

export const GNOCE = {
  id: "gnoce",
  name: "Gnoce",
  logo: "https://www.gnoce.com/media/logo/websites/1/logo.svg",
  categories: [
    { id: "charm", name: "Charms" },
    { id: "bracelets", name: "Bracelets" },
    { id: "necklaces", name: "Necklaces" },
    { id: "rings", name: "Rings" },
    { id: "earrings", name: "Earrings" },
  ],
};

export const shops = [PANDORA, GNOCE];

const store = createStore({
  state() {
    return {
      selectedShop: shops[0],
      shops,
    };
  },
  mutations: {
    selectShop(state, shop) {
      state.selectedShop = shop;
    },
  },
  actions: {
    selectShop({ commit }, shop) {
      commit("selectShop", shop);
    },
  },
  getters: {
    selectedShop(state) {
      return state.selectedShop;
    },
    shops(state) {
      return state.shops;
    },
  },
});

export default store;
