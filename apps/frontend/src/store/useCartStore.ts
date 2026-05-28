import { create } from 'zustand';
import type { CartItem } from '../types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  deliveryMode: 'delivery' | 'pickup';
  couponCode: string | null;
  discountAmount: number;
  setIsOpen: (open: boolean) => void;
  setDeliveryMode: (mode: 'delivery' | 'pickup') => void;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  applyCoupon: (code: string, discount: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isOpen: false,
  deliveryMode: 'delivery',
  couponCode: null,
  discountAmount: 0,
  setIsOpen: (isOpen) => set({ isOpen }),
  setDeliveryMode: (deliveryMode) => set({ deliveryMode }),
  addItem: (item) => {
    const items = [...get().items];
    const matchIndex = items.findIndex(
      (i) => i.productId === item.productId && i.selectedVariantId === item.selectedVariantId
    );
    if (matchIndex > -1) {
      items[matchIndex].quantity += item.quantity;
    } else {
      items.push(item);
    }
    set({ items });
  },
  removeItem: (productId, variantId) => {
    const items = get().items.filter(
      (i) => !(i.productId === productId && i.selectedVariantId === variantId)
    );
    set({ items });
  },
  updateQuantity: (productId, quantity, variantId) => {
    if (quantity <= 0) {
      get().removeItem(productId, variantId);
      return;
    }
    const items = get().items.map((i) =>
      i.productId === productId && i.selectedVariantId === variantId ? { ...i, quantity } : i
    );
    set({ items });
  },
  applyCoupon: (couponCode, discountAmount) => set({ couponCode, discountAmount }),
  clearCart: () => set({ items: [], couponCode: null, discountAmount: 0 }),
  getSubtotal: () => {
    return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },
  getTotal: () => {
    const subtotal = get().getSubtotal();
    const deliveryFee = get().deliveryMode === 'delivery' ? 1.50 : 0;
    return Math.max(0, subtotal + deliveryFee - get().discountAmount);
  },
}));
