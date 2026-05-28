import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DeliveryZoneDocument = DeliveryZone & Document;

@Schema({ _id: false })
export class GeoJSONGeometry {
  @Prop({ type: String, enum: ['Polygon'], required: true })
  type: string;

  @Prop({ type: [[[Number]]], required: true })
  coordinates: number[][][];
}

export const GeoJSONGeometrySchema = SchemaFactory.createForClass(GeoJSONGeometry);

@Schema({ timestamps: true })
export class DeliveryZone {
  @Prop({ required: true })
  name: string;

  @Prop({ type: GeoJSONGeometrySchema, required: true, index: '2dsphere' })
  geometry: GeoJSONGeometry;

  @Prop({ required: true, type: Number })
  minOrderValue: number;

  @Prop({ required: true, type: Number })
  deliveryFee: number;
}

export const DeliveryZoneSchema = SchemaFactory.createForClass(DeliveryZone);
