import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PosDeviceDocument = PosDevice & Document;

@Schema({ timestamps: true })
export class PosDevice {
  @Prop({ required: true, unique: true })
  deviceId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: ['online', 'offline', 'maintenance'], default: 'offline' })
  status: string;

  @Prop()
  lastHeartbeat: Date;
}

export const PosDeviceSchema = SchemaFactory.createForClass(PosDevice);
