import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { Product } from 'src/entities/product.entity';
import { Order } from 'src/entities/order.entity';
import { User } from 'src/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Order, User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your_secret_key',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AdminController],
  providers: [AdminService, JwtAuthGuard],
})
export class AdminModule {}
