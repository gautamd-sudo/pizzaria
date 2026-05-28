export interface Address {
  street: string;
  zipCode: string;
  city: string;
  note?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin' | 'driver';
  addresses: Address[];
}

export interface Category {
  id: string;
  name: string;
  displayOrder: number;
  isPublished: boolean;
}

export interface ProductVariant {
  variantId: string;
  name: string;
  priceDelta: number;
  isAvailable: boolean;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  categoryId: string;
  imageUrl?: string;
  tags: string[];
  variants: ProductVariant[];
  addonIds: string[];
  prepTimeRange: string;
  isAvailable: boolean;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  selectedVariantId?: string;
  selectedVariantName?: string;
  notes?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  selectedVariantId?: string;
  selectedAddons?: Array<{
    addonId: string;
    name: string;
    price: number;
  }>;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discountAmount: number;
  total: number;
  status: 'new' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  paymentStatus: 'unpaid' | 'paid' | 'refunded';
  paymentMethod: 'credit_card' | 'paypal' | 'cash_on_delivery';
  deliveryAddress: Address;
  driverName?: string;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed_amount' | 'free_delivery';
  value: number;
  minOrderAmount?: number;
  validUntil: string;
}
