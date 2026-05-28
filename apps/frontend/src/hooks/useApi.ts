import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../config/api';
import { useAuthStore } from '../store/useAuthStore';
import type { Category, Product, Order, Coupon, User } from '../types';

interface AuthResponse {
  accessToken: string;
  user: User;
}

// Authentication Hooks
export const useLogin = () => {
  const setSession = useAuthStore((state) => state.setSession);
  return useMutation<AuthResponse, Error, any>({
    mutationFn: async (credentials) => {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    },
    onSuccess: (data) => {
      setSession(data.user, data.accessToken);
    },
  });
};

export const useSignup = () => {
  const setSession = useAuthStore((state) => state.setSession);
  return useMutation<AuthResponse, Error, any>({
    mutationFn: async (userData) => {
      const response = await api.post('/auth/signup', userData);
      return response.data;
    },
    onSuccess: (data) => {
      setSession(data.user, data.accessToken);
    },
  });
};

export const useLogout = () => {
  const clearSession = useAuthStore((state) => state.clearSession);
  const queryClient = useQueryClient();
  return useMutation<void, Error, void>({
    mutationFn: async () => {
      await api.post('/auth/logout');
    },
    onSettled: () => {
      clearSession();
      queryClient.clear();
    },
  });
};

// Catalog Hooks
export const useCategories = () => {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get('/categories');
      return response.data;
    },
  });
};

export const useProducts = (categoryId?: string, isAvailable?: boolean) => {
  return useQuery<{ data: Product[]; total: number }>({
    queryKey: ['products', categoryId, isAvailable],
    queryFn: async () => {
      const params: any = {};
      if (categoryId) params.categoryId = categoryId;
      if (isAvailable !== undefined) params.isAvailable = isAvailable;
      const response = await api.get('/products', { params });
      return response.data;
    },
  });
};

// Checkout & Promo Hooks
export const useValidateCoupon = () => {
  return useMutation<Coupon, Error, { code: string; orderAmount: number }>({
    mutationFn: async ({ code, orderAmount }) => {
      const response = await api.get('/coupons/validate', {
        params: { code, orderAmount },
      });
      return response.data;
    },
  });
};

export const usePlaceOrder = () => {
  const queryClient = useQueryClient();
  return useMutation<Order, Error, any>({
    mutationFn: async (orderData) => {
      const response = await api.post('/orders', orderData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

export const useOrderTracking = (orderId: string) => {
  return useQuery<Order>({
    queryKey: ['order', orderId],
    queryFn: async () => {
      const response = await api.get(`/orders/${orderId}`);
      return response.data;
    },
    enabled: !!orderId,
    refetchInterval: 10000, // Poll every 10s
  });
};

// Admin Console Hooks
export const useAdminOrders = (status?: string) => {
  return useQuery<Order[]>({
    queryKey: ['admin-orders', status],
    queryFn: async () => {
      const response = await api.get('/admin/orders', {
        params: status ? { status } : {},
      });
      return response.data;
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation<Order, Error, { id: string; status: string; driverName?: string }>({
    mutationFn: async ({ id, status, driverName }) => {
      const response = await api.patch(`/orders/${id}/status`, { status, driverName });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    },
  });
};

export const useAdminWidgets = () => {
  return useQuery<any>({
    queryKey: ['admin-widgets'],
    queryFn: async () => {
      const response = await api.get('/admin/analytics/widgets');
      return response.data;
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation<Product, Error, { id: string; data: any }>({
    mutationFn: async ({ id, data }) => {
      const response = await api.patch(`/admin/products/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};
