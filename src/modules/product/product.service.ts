import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from 'src/entities/product.entity';
import { CreateProductDto } from 'src/modules/DTOs/create-product.dto';
import { UpdateProductDto } from 'src/modules/DTOs/update-product.dto';
import { UpdateDiscountDto } from '../DTOs/update-discount.dto';
import { Cart } from 'src/entities/cart.entity'; 

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Cart) 
    private readonly cartRepository: Repository<Cart>,
  ) {}

  async create(data: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(data);
    return await this.productRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return await this.productRepository.find();
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found.`);
    }
    return product;
  }

  async update(id: number, data: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    Object.assign(product, data);
    return await this.productRepository.save(product);
  }

  async remove(id: number): Promise<void> {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found.`);
    }

    // ✅ First, delete all cart items referencing this product
    await this.cartRepository.delete({ product: { id } });

    // ✅ Now, delete the product safely
    await this.productRepository.delete(id);
  }

  async updateDiscount(id: number, updateDiscountDto: UpdateDiscountDto): Promise<string> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found.`);
    }

    product.discount = updateDiscountDto.discount;
    await this.productRepository.save(product);

    return 'Product discount updated successfully!';
  }
}
