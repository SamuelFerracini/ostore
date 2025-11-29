// @ts-nocheck
import { createStore } from "vuex";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  primaryImage: string;
  category?: string;
  shop?: string;
  quantity: number;
}

// Helper functions for localStorage
const saveToLocalStorage = (items: CartItem[]) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("cart", JSON.stringify(items));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }
};

const loadFromLocalStorage = (): CartItem[] => {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("cart");
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
      return [];
    }
  }
  return [];
};

const store = createStore({
  state() {
    return {
      items: loadFromLocalStorage(),
    };
  },

  mutations: {
    ADD_TO_CART(state, product: Omit<CartItem, "quantity">) {
      const existingItem = state.items.find((item) => item.id === product.id);

      if (existingItem) {
        existingItem.quantity++;
      } else {
        state.items.push({ ...product, quantity: 1 });
      }

      saveToLocalStorage(state.items);
    },

    REMOVE_FROM_CART(state, productId: string) {
      state.items = state.items.filter((item) => item.id !== productId);
      saveToLocalStorage(state.items);
    },

    UPDATE_QUANTITY(
      state,
      { productId, quantity }: { productId: string; quantity: number }
    ) {
      const item = state.items.find((item) => item.id === productId);

      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter((item) => item.id !== productId);
        } else {
          item.quantity = quantity;
        }
        saveToLocalStorage(state.items);
      }
    },

    CLEAR_CART(state) {
      state.items = [];
      saveToLocalStorage(state.items);
    },

    LOAD_CART(state) {
      state.items = loadFromLocalStorage();
    },
  },

  actions: {
    addToCart({ commit }, product: Omit<CartItem, "quantity">) {
      commit("ADD_TO_CART", product);
    },

    removeFromCart({ commit }, productId: string) {
      commit("REMOVE_FROM_CART", productId);
    },

    updateQuantity(
      { commit },
      payload: { productId: string; quantity: number }
    ) {
      commit("UPDATE_QUANTITY", payload);
    },

    clearCart({ commit }) {
      commit("CLEAR_CART");
    },

    loadCart({ commit }) {
      commit("LOAD_CART");
    },
  },

  getters: {
    cartItems(state) {
      return state.items;
    },

    cartCount(state) {
      return state.items.reduce((total, item) => total + item.quantity, 0);
    },

    cartTotal(state) {
      return state.items.reduce(
        (total, item) => total + Number(item.price_normalised) * item.quantity,
        0
      );
    },

    isInCart: (state) => (productId: string) => {
      return state.items.some((item) => item.id === productId);
    },
  },
});

export default store;
