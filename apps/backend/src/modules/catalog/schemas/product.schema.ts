import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ _id: false })
export class ProductVariant {
  @Prop({ required: true })
  variantId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, type: Number })
  priceDelta: number;

  @Prop({ required: true, default: true })
  isAvailable: boolean;
}

export const ProductVariantSchema = SchemaFactory.createForClass(ProductVariant);

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true, type: Number })
  price: number;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Category' })
  categoryId: Types.ObjectId;

  @Prop()
  imageUrl: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: [ProductVariantSchema], default: [] })
  variants: ProductVariant[];

  @Prop({ type: [Types.ObjectId], default: [] })
  addonIds: Types.ObjectId[];

  @Prop({ default: '15-20 min' })
  prepTimeRange: string;

  @Prop({ required: true, default: true })
  isAvailable: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
