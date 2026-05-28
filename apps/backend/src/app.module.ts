import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bullmq';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CatalogModule } from './modules/catalog/catalog.module';
import { OrdersModule } from './modules/orders/orders.module';
import { CouponsModule } from './modules/coupons/coupons.module';
import { DeliveryZonesModule } from './modules/delivery-zones/delivery-zones.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { GatewayModule } from './modules/gateway/gateway.module';
import { PosModule } from './modules/pos/pos.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { NotificationsModule } from './modules/notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../../.env', '../.env'],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI') || 'mongodb://localhost:27017/pizzarally',
      }),
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST') || 'localhost',
          port: configService.get<number>('REDIS_PORT') || 6379,
        },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    CatalogModule,
    OrdersModule,
    CouponsModule,
    DeliveryZonesModule,
    PaymentsModule,
    GatewayModule,
    PosModule,
    AnalyticsModule,
    NotificationsModule,
  ],
})
export class AppModule {}
