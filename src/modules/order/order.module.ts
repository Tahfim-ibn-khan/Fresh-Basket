import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/entities/order.entity';
import { Cart } from 'src/entities/cart.entity';
import { User } from 'src/entities/user.entity';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Cart, User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your_secret_key',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [OrderController],
  providers: [OrderService, JwtAuthGuard, RolesGuard],
})
export class OrderModule {}
