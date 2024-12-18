import { Controller, Post, Get, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from 'src/modules/DTOs/create-category.dto';
import { UpdateCategoryDto } from 'src/modules/DTOs/update-category.dto';
import { Category } from 'src/entities/category.entity';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('categories')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('/create')
  @Roles('admin') 
  async create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoryService.create(createCategoryDto);
  }

  @Get('/getall')
  @Roles('admin', 'store-manager', 'customer') 
  async findAll(): Promise<Category[]> {
    return this.categoryService.findAll();
  }

  @Get('get/:id')
  @Roles('admin', 'store-manager', 'customer')
  async findOne(@Param('id') id: number): Promise<Category> {
    return this.categoryService.findOne(id);
  }

  @Post('update/:id')
  @Roles('admin', 'store-manager') 
  async update(
    @Param('id') id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Post('delete/:id')
  @Roles('admin')
  async remove(@Param('id') id: number): Promise<void> {
    return this.categoryService.remove(id);
  }
}
