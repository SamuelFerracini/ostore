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
  size?: string;
  key: string;
}

export const cartKey = (id: string, size?: string | null): string =>
  size ? `${id}::${size}` : id;

const withKey = (item: any): CartItem => ({
  ...item,
  key: item.key ?? cartKey(item.id, item.size),
});

// Helper function to load and validate cart items against products.json
const validateCartItems = async (items: CartItem[]): Promise<CartItem[]> => {
  if (items.length === 0) return items;

  try {
    const response = await fetch("/products.json");
    if (!response.ok) {
      console.error("Failed to load products.json for validation");
      return items;
    }

    const productsData = await response.json();

    // Create a Set of all valid product IDs for fast lookup
    const validProductIds = new Set<string>();

    Object.keys(productsData).forEach((shop) => {
      Object.keys(productsData[shop]).forEach((category) => {
        productsData[shop][category].forEach((product: any) => {
          validProductIds.add(product.id);
        });
      });
    });

    // Filter cart items to only include valid products
    const validItems = items.filter((item) => {
      const isValid = validProductIds.has(item.id);
      if (!isValid) {
        console.warn(
          `Removing invalid product from cart: ${item.name} (ID: ${item.id})`
        );
      }
      return isValid;
    });

    // If items were removed, update localStorage
    if (validItems.length !== items.length) {
      console.log(
        `Removed ${items.length - validItems.length} invalid items from cart`
      );
    }

    return validItems;
  } catch (error) {
    console.error("Error validating cart items:", error);
    return items; // Return original items if validation fails
  }
};

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
      return stored ? JSON.parse(stored).map(withKey) : [];
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
      validationComplete: false,
    };
  },

  mutations: {
    ADD_TO_CART(state, product: Omit<CartItem, "quantity" | "key">) {
      const key = cartKey(product.id, product.size);
      const existingItem = state.items.find((item) => item.key === key);

      if (existingItem) {
        existingItem.quantity++;
      } else {
        state.items.push({ ...product, key, quantity: 1 });
      }

      saveToLocalStorage(state.items);
    },

    REMOVE_FROM_CART(state, key: string) {
      state.items = state.items.filter((item) => item.key !== key);
      saveToLocalStorage(state.items);
    },

    UPDATE_QUANTITY(
      state,
      { productId, quantity }: { productId: string; quantity: number }
    ) {
      const item = state.items.find((item) => item.key === productId);

      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter((item) => item.key !== productId);
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

    VALIDATE_CART(state, validatedItems: CartItem[]) {
      state.items = validatedItems.map(withKey);
      state.validationComplete = true;
      saveToLocalStorage(state.items);
    },

    SET_VALIDATION_COMPLETE(state, value: boolean) {
      state.validationComplete = value;
    },
  },

  actions: {
    addToCart({ commit }, product: Omit<CartItem, "quantity" | "key">) {
      commit("ADD_TO_CART", product);
    },

    removeFromCart({ commit }, key: string) {
      commit("REMOVE_FROM_CART", key);
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

    async loadCart({ commit, state }) {
      commit("LOAD_CART");
      // Validate cart items against products.json
      const validatedItems = await validateCartItems(state.items);
      if (validatedItems.length !== state.items.length) {
        commit("VALIDATE_CART", validatedItems);
      }
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

    isValidationComplete(state) {
      return state.validationComplete;
    },
  },
});

export default store;
