import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' }, namespace: '/' })
export class OrderGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`WebSocket client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`WebSocket client disconnected: ${client.id}`);
  }

  @SubscribeMessage('subscribe_to_order')
  handleSubscribeToOrder(client: Socket, payload: { orderId: string }) {
    client.join(`customer:order:${payload.orderId}`);
    console.log(`Client ${client.id} subscribed to customer:order:${payload.orderId}`);
  }

  @SubscribeMessage('subscribe_to_pipeline')
  handleSubscribeToPipeline(client: Socket) {
    client.join('admin:orders:pipeline');
    console.log(`Client ${client.id} subscribed to admin:orders:pipeline`);
  }

  emitOrderStatusUpdate(orderId: string, status: string, driverName?: string) {
    this.server.to(`customer:order:${orderId}`).emit('order_status_updated', { orderId, status, driverName });
    this.server.to('admin:orders:pipeline').emit('order_status_updated', { orderId, status, driverName });
  }

  emitOrderCreated(order: any) {
    this.server.to('admin:orders:pipeline').emit('order_created', order);
  }
}
