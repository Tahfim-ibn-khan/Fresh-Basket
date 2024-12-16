import { Controller, Post, Get, Put, Delete, Param, Body } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from 'src/modules/DTOs/create-category.dto';
import { UpdateCategoryDto } from 'src/modules/DTOs/update-category.dto';
import { Category } from 'src/entities/category.entity';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post("/create")
  async create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoryService.create(createCategoryDto);
  }

  @Get("/getall")
  async findAll(): Promise<Category[]> {
    return this.categoryService.findAll();
  }

  @Get('get/:id')
  async findOne(@Param('id') id: number): Promise<Category> {
    return this.categoryService.findOne(id);
  }

  @Post('update/:id')
  async update(
    @Param('id') id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Post('delete/:id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.categoryService.remove(id);
  }
}
