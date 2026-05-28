import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ _id: false })
export class Address {
  @Prop({ required: true })
  street: string;

  @Prop({ required: true })
  zipCode: string;

  @Prop({ required: true })
  city: string;

  @Prop()
  note?: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop()
  phone: string;

  @Prop({ required: true, enum: ['customer', 'admin', 'driver'], default: 'customer' })
  role: string;

  @Prop({ type: [AddressSchema], default: [] })
  addresses: Address[];
}

export const UserSchema = SchemaFactory.createForClass(User);
