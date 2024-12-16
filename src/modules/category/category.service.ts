import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from 'src/entities/category.entity';
import { CreateCategoryDto } from 'src/modules/DTOs/create-category.dto';
import { UpdateCategoryDto } from 'src/modules/DTOs/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(data: CreateCategoryDto): Promise<Category> {
    const category = this.categoryRepository.create(data);
    return await this.categoryRepository.save(category);
  }

async findAll(): Promise<Category[]> {
  return await this.categoryRepository.find();
}
  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found.`);
    }
    return category;
  }


  async update(id: number, data: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);
    Object.assign(category, data);
    return await this.categoryRepository.save(category);
  }

async remove(id: number): Promise<void> {
    const category = await this.findOne(id);
    await this.categoryRepository.remove(category);
  }
}
