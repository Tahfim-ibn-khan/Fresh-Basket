import { Controller, Get, Post, Delete, Body, Query } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { CreateWishlistDto } from 'src/modules/DTOs/create-wishlist.dto';
import { RemoveWishlistDto } from 'src/modules/DTOs/remove-wishlist.dto';

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post('add')
  async addToWishlist(@Body() createWishlistDto: CreateWishlistDto) {
    return this.wishlistService.addToWishlist(createWishlistDto);
  }

  @Delete('remove')
  async removeFromWishlist(@Body() removeWishlistDto: RemoveWishlistDto) {
    await this.wishlistService.removeFromWishlist(removeWishlistDto);
    return { message: 'Product removed from wishlist successfully.' };
  }

  @Get()
  async getWishlist(@Query('userId') userId: number) {
    return this.wishlistService.getWishlist(userId);
  }
}
