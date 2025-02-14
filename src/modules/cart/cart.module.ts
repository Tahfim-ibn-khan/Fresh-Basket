import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from 'src/entities/cart.entity';
import { Product } from 'src/entities/product.entity';
import { User } from 'src/entities/user.entity'; 
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { JwtModule } from '@nestjs/jwt';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, Product, User]), 
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your_secret_key',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [CartController],
  providers: [CartService, JwtAuthGuard, RolesGuard],
})
export class CartModule {}
