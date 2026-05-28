import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || window.location.origin;

export const useSocket = (room?: { type: 'order'; orderId: string } | { type: 'pipeline' }) => {
  const queryClient = useQueryClient();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Connect to websocket server root namespace
    const socket = io(SOCKET_URL, {
      transports: ['websocket'],
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('WebSocket connected:', socket.id);
      if (room) {
        if (room.type === 'order') {
          socket.emit('subscribe_to_order', { orderId: room.orderId });
        } else if (room.type === 'pipeline') {
          socket.emit('subscribe_to_pipeline');
        }
      }
    });

    // Listen for order status updates
    socket.on('order_status_updated', (data: { orderId: string; status: string; driverName?: string }) => {
      console.log('Real-time order status updated:', data);
      // Invalidate queries so React Query auto-refetches in the background
      queryClient.invalidateQueries({ queryKey: ['order', data.orderId] });
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    });

    // Listen for new orders (admin pipeline)
    socket.on('order_created', (order: any) => {
      console.log('Real-time order created:', order);
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin-widgets'] });
    });

    return () => {
      socket.disconnect();
    };
  }, [room, queryClient]);

  return socketRef.current;
};
