import { createStore } from "vuex";

const PANDORA = {
  id: "pandora",
  name: "Pandora",
  categories: [
    { id: "charms", name: "Charms" },
    { id: "rings", name: "Rings" },
    { id: "charms-and-bracelets", name: "Charms and Bracelets" },
  ],
};

const GNOCE = {
  id: "gnoce",
  name: "Gnoce",
  categories: [
    { id: "charms", name: "Charms" },
    { id: "bracelets", name: "Bracelets" },
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
