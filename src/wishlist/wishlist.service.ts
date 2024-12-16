import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Wishlist } from 'src/entities/wishlist.entity';
import { CreateWishlistDto } from 'src/modules/DTOs/create-wishlist.dto';
import { RemoveWishlistDto } from 'src/modules/DTOs/remove-wishlist.dto';

@Injectable()
export class WishlistService {
  constructor(
    @Inject('WishlistRepository')
    private readonly wishlistRepository: Repository<Wishlist>,
  ) {}

  async addToWishlist(createWishlistDto: CreateWishlistDto): Promise<Wishlist> {
    const { userId, productId } = createWishlistDto;

    // Check if the product is already in the wishlist
    const existingItem = await this.wishlistRepository.findOneBy({ userId, productId });
    if (existingItem) {
      throw new Error('Product is already in the wishlist.');
    }

    // Add the item to the wishlist
    const wishlistItem = this.wishlistRepository.create(createWishlistDto);
    return this.wishlistRepository.save(wishlistItem);
  }

  async removeFromWishlist(removeWishlistDto: RemoveWishlistDto): Promise<void> {
    const { userId, productId } = removeWishlistDto;

    // Remove the item from the wishlist
    const result = await this.wishlistRepository.delete({ userId, productId });
    if (result.affected === 0) {
      throw new Error('Product not found in the wishlist.');
    }
  }

  async getWishlist(userId: number): Promise<Wishlist[]> {
    return this.wishlistRepository.find({ where: { userId } });
  }
}
