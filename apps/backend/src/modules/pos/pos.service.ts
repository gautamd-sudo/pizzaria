import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PosDevice, PosDeviceDocument } from './schemas/pos-device.schema';

@Injectable()
export class PosService {
  constructor(@InjectModel(PosDevice.name) private posModel: Model<PosDeviceDocument>) {}

  async recordHeartbeat(deviceId: string, status: string): Promise<void> {
    await this.posModel.findOneAndUpdate(
      { deviceId },
      { $set: { status, lastHeartbeat: new Date() } },
      { upsert: true, new: true },
    ).exec();
  }
}
