import { Controller, Post, Get, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from 'src/modules/DTOs/create-product.dto';
import { UpdateProductDto } from 'src/modules/DTOs/update-product.dto';
import { Product } from 'src/entities/product.entity';
import { UpdateDiscountDto } from '../DTOs/update-discount.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard) // Apply guards globally to all routes in this controller
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('/create')
  @Roles('admin', 'store-manager') // Only admin and store-manager can create products
  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productService.create(createProductDto);
  }

  @Get('/getall')
  @Roles('admin', 'store-manager', 'customer') // Admin, store-manager, and customer can view all products
  async findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @Get('get/:id')
  @Roles('admin', 'store-manager', 'customer') // Allow access to specific product details
  async findOne(@Param('id') id: number): Promise<Product> {
    return this.productService.findOne(id);
  }

  @Post('update/:id')
  @Roles('admin', 'store-manager') // Only admin and store-manager can update products
  async update(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productService.update(id, updateProductDto);
  }

  @Post('delete/:id')
  @Roles('admin') // Only admin can delete products
  async remove(@Param('id') id: number): Promise<void> {
    return this.productService.remove(id);
  }

  @Post('discount/:id')
  @Roles('admin', 'store-manager') // Admin and store-manager can apply discounts
  async updateDiscount(
    @Param('id') id: number,
    @Body() updateDiscountDto: UpdateDiscountDto,
  ): Promise<string> {
    return this.productService.updateDiscount(id, updateDiscountDto);
  }
}
