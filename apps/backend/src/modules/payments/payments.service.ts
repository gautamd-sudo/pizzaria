import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Payment, PaymentDocument } from './schemas/payment.schema';

@Injectable()
export class PaymentsService {
  constructor(@InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>) {}

  async createSession(orderId: string, amount: number, gateway: string): Promise<{ checkoutUrl: string; sessionId: string }> {
    const payment = new this.paymentModel({
      orderId: new Types.ObjectId(orderId),
      gateway,
      amount,
      status: 'pending',
    });
    const saved = await payment.save();
    return {
      checkoutUrl: `https://checkout.pizzarally.de/pay/${saved._id.toString()}`,
      sessionId: saved._id.toString(),
    };
  }

  async processWebhook(payload: any): Promise<void> {
    const { sessionId, status, transactionId } = payload;
    const payment = await this.paymentModel.findById(sessionId);
    if (!payment) {
      throw new NotFoundException('Payment session not found');
    }
    payment.status = status === 'success' ? 'completed' : 'failed';
    payment.transactionId = transactionId || 'TXN_TEST';
    payment.gatewayLogs = payload;
    await payment.save();
  }
}
