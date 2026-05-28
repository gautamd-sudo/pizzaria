import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
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
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'frontend', 'dist'),
      exclude: ['/api/(.*)'],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI') || 'mongodb://localhost:27017/pizzarally',
        dbName: 'pizzarally',
      }),
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const url = configService.get<string>('REDIS_URL');
        if (url) {
          try {
            const parsed = new URL(url);
            const isTls = parsed.protocol === 'rediss:';
            return {
              connection: {
                host: parsed.hostname,
                port: parseInt(parsed.port || '6379', 10),
                username: parsed.username || undefined,
                password: parsed.password || undefined,
                tls: isTls ? { rejectUnauthorized: false } : undefined,
              },
            };
          } catch (e) {
            // fallback if URL parsing fails
          }
        }

        let host = configService.get<string>('REDIS_HOST') || 'localhost';
        // Strip protocol prefix (e.g. https://) and trailing paths
        host = host.replace(/^(https?|rediss?):\/\//i, '').split('/')[0].split(':')[0];

        const port = configService.get<number>('REDIS_PORT') || 6379;
        const password = configService.get<string>('REDIS_PASSWORD');
        const useTls = configService.get<boolean>('REDIS_TLS') || host.includes('upstash.io');

        return {
          connection: {
            host,
            port,
            password: password || undefined,
            tls: useTls ? { rejectUnauthorized: false } : undefined,
          },
        };
      },
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
