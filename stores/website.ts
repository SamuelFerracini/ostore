import { createStore } from "vuex";

const PANDORA = {
  id: "pandora",
  name: "Pandora",
  categories: [
    { id: "40_off", name: "40% OFF" },
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

const shops = [PANDORA, GNOCE];

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
