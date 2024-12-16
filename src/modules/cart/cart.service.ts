import { Injectable, NotFoundException } from '@nestjs/common';
import { AddToCartDto } from '../DTOs/add-to-cart.dto';
import { DeleteFromCartDto } from '../DTOs/delete-from-cart.dto';

@Injectable()
export class CartService {
  private carts: Record<string, any[]> = {}; // Simple in-memory cart store

  // Add a product to the cart
  async addProductToCart(addToCartDto: AddToCartDto): Promise<any> {
    const { userId, productId, quantity } = addToCartDto;

    if (!this.carts[userId]) {
      this.carts[userId] = [];
    }

    const existingProduct = this.carts[userId].find(
      (item) => item.productId === productId,
    );

    if (existingProduct) {
      existingProduct.quantity += quantity; // Update the quantity
    } else {
      this.carts[userId].push({ productId, quantity }); // Add new product
    }

    return { message: 'Product added to cart successfully', cart: this.carts[userId] };
  }

  // Delete a product from the cart
  async deleteProductFromCart(deleteFromCartDto: DeleteFromCartDto): Promise<any> {
    const { userId, productId } = deleteFromCartDto;

    if (!this.carts[userId]) {
      throw new NotFoundException('Cart not found for the user');
    }

    const productIndex = this.carts[userId].findIndex(
      (item) => item.productId === productId,
    );

    if (productIndex === -1) {
      throw new NotFoundException('Product not found in the cart');
    }

    this.carts[userId].splice(productIndex, 1); // Remove the product

    return { message: 'Product removed from cart successfully', cart: this.carts[userId] };
  }
}
