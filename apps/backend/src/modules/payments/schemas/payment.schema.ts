import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PaymentDocument = Payment & Document;

@Schema({ timestamps: true })
export class Payment {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Order' })
  orderId: Types.ObjectId;

  @Prop()
  transactionId: string;

  @Prop({ required: true, enum: ['stripe', 'paypal', 'cash'] })
  gateway: string;

  @Prop({ required: true, type: Number })
  amount: number;

  @Prop({ required: true, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' })
  status: string;

  @Prop({ type: Object })
  gatewayLogs: Record<string, any>;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
