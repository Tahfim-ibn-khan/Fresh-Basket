import { Controller, Post, Get, Put, Delete, Param, Body } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from 'src/modules/DTOs/create-product.dto';
import { UpdateProductDto } from 'src/modules/DTOs/update-product.dto';
import { Product } from 'src/entities/product.entity';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post("/create")
  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productService.create(createProductDto);
  }

  @Get("/getall")
  async findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @Get('get/:id')
  async findOne(@Param('id') id: number): Promise<Product> {
    return this.productService.findOne(id);
  }

  @Post('update/:id')
  async update(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productService.update(id, updateProductDto);
  }

  @Post('delete/:id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.productService.remove(id);
  }
}
