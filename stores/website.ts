import { createStore } from "vuex";

const PANDORA = {
  id: "pandora",
  name: "Pandora",
  categories: [
    { id: "charm", name: "Charms" },
    { id: "bracelets", name: "Bracelets" },
    { id: "necklaces", name: "Necklaces" },
    { id: "rings", name: "Rings" },
    { id: "earrings", name: "Earrings" },
    { id: "gift-sets", name: "Gift Sets" },
    { id: "accessories", name: "Accessories" },
  ],
};

const GNOCE = {
  id: "gnoce",
  name: "Gnoce",
  categories: [
    { id: "charm", name: "Charms" },
    { id: "bracelets", name: "Bracelets" },
    { id: "necklaces", name: "Necklaces" },
    { id: "rings", name: "Rings" },
    { id: "earrings", name: "Earrings" },
  ],
};

const shops = [GNOCE, PANDORA];

const store = createStore({
  state() {
    return {
      selectedShop: GNOCE,
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
