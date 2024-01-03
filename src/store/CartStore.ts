import { Item } from "@/types";
import {create} from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface CartState {
    cart: Item[];
    addProduct: (product: Item) => void;
    removeProduct: (id: number) => void;
    removeAll:( ) => void;
    updateQuantity: (id: number, quantity: number) => void;
}

export const useCartStore = create<CartState>()(
    persist(
      (set) => ({
        cart: [],
        addProduct: (product) => set((state) => ({ cart: [...state.cart, product] })),
        removeProduct: (id) => set((state) => ({
          cart: state.cart.filter((product) => product.id !== id),
        })),
        removeAll: () => set({ cart: [] }),
        updateQuantity: (id, quantity) =>
        set((state) => ({
          cart: state.cart.map((product) =>
            product.id === id ? { ...product, quantity } : product
          ),
        })),
      }),
      {
        name: "cart",
        storage: createJSONStorage(() => sessionStorage), 
      }
    )
  );