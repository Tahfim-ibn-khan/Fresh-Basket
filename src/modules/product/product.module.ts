import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/entities/product.entity';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { AuthModule } from '../auth/auth.module'; // Correct import path
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Cart } from 'src/entities/cart.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product,Cart]),
    AuthModule, // Import AuthModule to provide JwtService
  ],
  controllers: [ProductController],
  providers: [ProductService, JwtAuthGuard, RolesGuard],
})
export class ProductModule {}
