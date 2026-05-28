import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { OrdersService } from './orders.service';

@Processor('orders')
export class OrdersProcessor extends WorkerHost {
  constructor(private readonly ordersService: OrdersService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    console.log(`[BullMQ Worker] Processing background job: ${job.name} for Order ID: ${job.data.orderId}`);
    
    if (job.name === 'validate-payment-timeout') {
      const order = await this.ordersService.findById(job.data.orderId);
      if (order.paymentStatus === 'unpaid' && order.paymentMethod !== 'cash_on_delivery' && order.status === 'new') {
        console.log(`[BullMQ Worker] Unpaid order timeout reached. Cancelling Order: ${order.orderNumber}`);
        await this.ordersService.updateStatus(order._id.toString(), 'cancelled');
      }
    }
  }
}
