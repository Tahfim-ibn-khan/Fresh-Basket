import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AdminModule } from './modules/admin/admin.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProductModule } from './modules/product/product.module';
import { CategoryModule } from './modules/category/category.module';
import { OrderModule } from './modules/order/order.module';
import { CartModule } from './modules/cart/cart.module';
import { UserModule } from './user/user.module';
import { PaymentModule } from './modules/payment/payment.module';

import { EmailService } from './services/email/email.service';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './common/guards/roles.guard';
import { JwtMiddleware } from './common/middleware/jwt.middleware';
import { JwtModule } from '@nestjs/jwt';
import { InvoiceModule } from './modules/invoice/invoice.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        url: 'postgresql://postgres:euFmQFtsyGOSgdlOgRLQLjGgbVlUOkdj@junction.proxy.rlwy.net:30325/railway',
        autoLoadEntities: true,
        synchronize: configService.get<boolean>('DB_SYNCHRONIZE', false),
        ssl: { rejectUnauthorized: false },
      }),
      inject: [ConfigService],
    }),
    AdminModule,
    AuthModule,
    ProductModule,
    CategoryModule,
    OrderModule,
    CartModule,
    UserModule,
    PaymentModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your_secret_key',
      signOptions: { expiresIn: '1h' },
    }),
    InvoiceModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    EmailService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard, 
    },
  ],
  exports: [EmailService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .exclude(
        { path: 'products/getall', method: RequestMethod.GET }, 
        { path: 'products/get/:id', method: RequestMethod.GET }, 
        { path: 'auth/login', method: RequestMethod.POST }, 
        { path: 'auth/register', method: RequestMethod.POST }, 
        { path: 'auth/verify-otp', method: RequestMethod.POST }, 
      )
      .forRoutes('*'); 
  }
}
