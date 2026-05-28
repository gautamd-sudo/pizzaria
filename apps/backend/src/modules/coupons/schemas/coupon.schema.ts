import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CouponDocument = Coupon & Document;

@Schema({ timestamps: true })
export class Coupon {
  @Prop({ required: true, unique: true })
  code: string;

  @Prop({ required: true, enum: ['percentage', 'fixed_amount', 'free_delivery'] })
  discountType: string;

  @Prop({ required: true, type: Number })
  value: number;

  @Prop({ type: Number, default: 0 })
  minOrderAmount: number;

  @Prop({ required: true })
  validFrom: Date;

  @Prop({ required: true })
  validUntil: Date;

  @Prop({ type: Number, default: 0 })
  usageLimit: number;

  @Prop({ type: Number, default: 0 })
  usageCount: number;
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);
