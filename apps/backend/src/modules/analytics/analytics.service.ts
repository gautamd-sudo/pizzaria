import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from '../orders/schemas/order.schema';

@Injectable()
export class AnalyticsService {
  constructor(@InjectModel(Order.name) private orderModel: Model<OrderDocument>) {}

  async getWidgetsData(): Promise<any> {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const ordersToday = await this.orderModel.find({ createdAt: { $gte: startOfToday } }).exec();
    const revenueToday = ordersToday.reduce((sum, o) => sum + o.total, 0);
    const averageOrderValue = ordersToday.length > 0 ? revenueToday / ordersToday.length : 0;
    const activeDeliveries = await this.orderModel.countDocuments({ status: 'out_for_delivery' }).exec();

    return {
      revenueToday: { value: revenueToday, percentageDelta: 12.5 },
      ordersToday: { value: ordersToday.length, percentageDelta: 4.2 },
      averageOrderValue: { value: averageOrderValue, percentageDelta: 2.1 },
      activeDeliveries,
    };
  }

  async getOrdersChannelData(): Promise<any[]> {
    // Return sample distribution data based on paymentMethod or orders context
    return [
      { channel: 'Web App', ordersCount: 142, revenue: 2482.0 },
      { channel: 'Mobile App', ordersCount: 84, revenue: 1210.5 },
      { channel: 'POS Terminal', ordersCount: 38, revenue: 490.0 },
    ];
  }
}
