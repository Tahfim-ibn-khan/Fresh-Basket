import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from 'src/entities/cart.entity';
import { Product } from 'src/entities/product.entity';
import { User } from 'src/entities/user.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>, // ✅ Ensure user repository is injected
  ) {}

  async addToCart(userId: number, productId: number, quantity: number): Promise<{ cartId: number; message: string }> {
    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) throw new NotFoundException('Product not found.');
  
    let cartItem = await this.cartRepository.findOne({ where: { user: { id: userId }, product: { id: productId } } });
  
    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      cartItem = this.cartRepository.create({ user: { id: userId }, product, quantity });
    }
  
    const savedCart = await this.cartRepository.save(cartItem);
    return { cartId: savedCart.id, message: 'Product added to cart successfully.' };
  }

  async getCart(userId: number): Promise<Cart[]> {
    const cartItems = await this.cartRepository.find({
      where: { user: { id: userId } },
      relations: ['product'], // ✅ Ensure product details are fetched
    });
  
    if (cartItems.length === 0) {
      throw new NotFoundException(`No items found in cart for user ID ${userId}`);
    }
  
    return cartItems;
  }
  

  async updateCart(userId: number, cartId: number, quantity: number): Promise<{ cartId: number; message: string }> {
    const cartItem = await this.cartRepository.findOne({ where: { id: cartId, user: { id: userId } } });
    if (!cartItem) throw new NotFoundException('Cart item not found.');
  
    if (quantity <= 0) {
      await this.cartRepository.remove(cartItem);
      return { cartId, message: 'Item removed from cart.' };
    }
  
    cartItem.quantity = quantity;
    await this.cartRepository.save(cartItem);
    return { cartId, message: 'Cart updated successfully.' };
  }

  async removeFromCart(userId: number, cartId: number): Promise<string> {
    const cartItem = await this.cartRepository.findOne({ where: { id: cartId, user: { id: userId } } });
    if (!cartItem) throw new NotFoundException('Cart item not found.');

    await this.cartRepository.remove(cartItem);
    return 'Item removed from cart.';
  }
}
