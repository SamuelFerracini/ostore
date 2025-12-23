import { createStore } from "vuex";

export const PANDORA = {
  id: "pandora",
  name: "Pandora",
  logo: "https://cdn.worldvectorlogo.com/logos/pandora-logo.svg",
  categories: [
    { id: "sale", name: "Sale" },
    { id: "christmas", name: "Christmas" },
    { id: "new-in", name: "New In" },
    { id: "charms", name: "Charms" },
    { id: "bracelets", name: "Bracelets" },
    { id: "rings", name: "Rings" },
    { id: "necklaces", name: "Necklaces" },
    { id: "earrings", name: "Earrings" },
    // { id: "engravable", name: "Engravable" },
    // { id: "gifts", name: "Gifts" },
    // { id: "lab-grown-diamonds", name: "Lab-Grown Diamonds" },
  ],
};

export const GNOCE = {
  id: "gnoce",
  name: "Gnoce",
  logo: "https://www.gnoce.com/media/logo/websites/1/logo.svg",
  categories: [
    { id: "charms", name: "Charms" },
    { id: "bracelets", name: "Bracelets" },
    { id: "basic-bracelets", name: "Basic Bracelets" },
    { id: "necklaces", name: "Necklaces" },
    { id: "rings", name: "Rings" },
    { id: "earrings", name: "Earrings" },
  ],
};

export const shops = [PANDORA];

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
