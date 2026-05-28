import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order, OrderSchema } from './schemas/order.schema';
import { CatalogModule } from '../catalog/catalog.module';
import { CouponsModule } from '../coupons/coupons.module';
import { BullModule } from '@nestjs/bullmq';
import { OrdersProcessor } from './orders.processor';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    BullModule.registerQueue({
      name: 'orders',
    }),
    CatalogModule,
    CouponsModule,
  ],
  providers: [OrdersService, OrdersProcessor],
  controllers: [OrdersController],
  exports: [OrdersService],
})
export class OrdersModule {}
