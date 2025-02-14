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
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'store-manager')
  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productService.create(createProductDto);
  }

  // ✅ MAKE GET ALL PRODUCTS PUBLIC
  @Get('/getall')
  async findAll() {
    return this.productService.findAll();
  }

  // ✅ MAKE GET PRODUCT BY ID PUBLIC
  @Get('get/:id')
  async findOne(@Param('id') id: number): Promise<Product> {
    return this.productService.findOne(id);
  }

  @Post('update/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'store-manager')
  async update(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productService.update(id, updateProductDto);
  }

  @Post('delete/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async remove(@Param('id') id: number): Promise<void> {
    return this.productService.remove(id);
  }

  @Post('discount/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'store-manager')
  async updateDiscount(
    @Param('id') id: number,
    @Body() updateDiscountDto: UpdateDiscountDto,
  ): Promise<string> {
    return this.productService.updateDiscount(id, updateDiscountDto);
  }
}
