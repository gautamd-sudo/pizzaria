import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Address, AddressSchema } from '../../users/schemas/user.schema';

export type OrderDocument = Order & Document;

@Schema({ _id: false })
export class SelectedAddon {
  @Prop({ required: true, type: Types.ObjectId, ref: 'ProductAddon' })
  addonId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, type: Number })
  price: number;
}

export const SelectedAddonSchema = SchemaFactory.createForClass(SelectedAddon);

@Schema({ _id: false })
export class OrderItem {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Product' })
  productId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop()
  selectedVariantId?: string;

  @Prop({ type: [SelectedAddonSchema], default: [] })
  selectedAddons: SelectedAddon[];

  @Prop({ required: true, type: Number })
  quantity: number;

  @Prop({ required: true, type: Number })
  price: number;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true, unique: true })
  orderNumber: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  customerId: Types.ObjectId;

  @Prop({ type: [OrderItemSchema], required: true })
  items: OrderItem[];

  @Prop({ required: true, type: Number })
  subtotal: number;

  @Prop({ required: true, type: Number, default: 0 })
  deliveryFee: number;

  @Prop({ type: Types.ObjectId, ref: 'Coupon', default: null })
  couponId: Types.ObjectId;

  @Prop({ type: Number, default: 0 })
  discountAmount: number;

  @Prop({ required: true, type: Number })
  total: number;

  @Prop({ required: true, enum: ['new', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'], default: 'new' })
  status: string;

  @Prop({ required: true, enum: ['unpaid', 'paid', 'refunded'], default: 'unpaid' })
  paymentStatus: string;

  @Prop({ required: true, enum: ['credit_card', 'paypal', 'cash_on_delivery'] })
  paymentMethod: string;

  @Prop({ type: AddressSchema, required: true })
  deliveryAddress: Address;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  driverId: Types.ObjectId;

  @Prop({ default: null })
  driverName: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
