import { Body, Controller, Delete, Post } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from '../DTOs/add-to-cart.dto';
import { DeleteFromCartDto } from '../DTOs/delete-from-cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // Add product to cart
  @Post('add')
  async addToCart(@Body() addToCartDto: AddToCartDto) {
    return this.cartService.addProductToCart(addToCartDto);
  }

  // Delete product from cart
  @Delete('delete')
  async deleteFromCart(@Body() deleteFromCartDto: DeleteFromCartDto) {
    return this.cartService.deleteProductFromCart(deleteFromCartDto);
  }
}
