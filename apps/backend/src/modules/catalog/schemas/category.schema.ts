import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true })
export class Category {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, default: 0 })
  displayOrder: number;

  @Prop({ required: true, default: true })
  isPublished: boolean;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
