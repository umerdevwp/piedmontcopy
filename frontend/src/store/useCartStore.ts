import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '../types';

interface CartStore {
    items: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    clearCart: () => void;
    getCartTotal: () => number;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            addToCart: (item) => set((state) => {
                const existingItem = state.items.find((i) =>
                    i.productId === item.productId &&
                    JSON.stringify(i.configurations) === JSON.stringify(item.configurations) &&
                    JSON.stringify(i.files) === JSON.stringify(item.files)
                );

                if (existingItem) {
                    return {
                        items: state.items.map((i) =>
                            i.id === existingItem.id
                                ? { ...i, quantity: i.quantity + item.quantity }
                                : i
                        )
                    };
                }

                return { items: [...state.items, item] };
            }),
            removeFromCart: (itemId) => set((state) => ({
                items: state.items.filter((i) => i.id !== itemId)
            })),
            updateQuantity: (itemId, quantity) => set((state) => ({
                items: state.items.map((i) =>
                    i.id === itemId ? { ...i, quantity } : i
                )
            })),
            clearCart: () => set({ items: [] }),
            getCartTotal: () => {
                const { items } = get();
                return items.reduce((total, item) => total + (item.totalPrice * item.quantity), 0);
            }
        }),
        {
            name: 'piedmont-cart-storage',
        }
    )
);
