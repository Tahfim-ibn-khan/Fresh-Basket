import { Controller, Post, Get, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('cart')
@UseGuards(JwtAuthGuard,RolesGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  @Roles('customer')
  async addToCart(@Body() body: { userId: number; productId: number; quantity: number }) {
    return this.cartService.addToCart(body.userId, body.productId, body.quantity);
  }

  @Get(':userId')
  @Roles('customer')
  async getCart(@Param('userId') userId: number) {
    return this.cartService.getCart(userId);
  }

  @Patch('update/:cartId')
  @Roles('customer')
  async updateCart(@Param('cartId') cartId: number, @Body() body: { userId: number; quantity: number }) {
    return this.cartService.updateCart(body.userId, cartId, body.quantity);
  }

  @Delete('remove/:cartId')
  @Roles('customer')
  async removeFromCart(@Param('cartId') cartId: number, @Body() body: { userId: number }) {
    return this.cartService.removeFromCart(body.userId, cartId);
  }
}
