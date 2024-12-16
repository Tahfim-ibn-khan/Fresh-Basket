import { IsNotEmpty, IsNumber } from 'class-validator';

export class RemoveWishlistDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsNumber()
  @IsNotEmpty()
  productId: number;
}

