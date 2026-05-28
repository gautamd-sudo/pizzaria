import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PosService } from './pos.service';
import { PosController } from './pos.controller';
import { PosDevice, PosDeviceSchema } from './schemas/pos-device.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: PosDevice.name, schema: PosDeviceSchema }]),
  ],
  providers: [PosService],
  controllers: [PosController],
  exports: [PosService],
})
export class PosModule {}
