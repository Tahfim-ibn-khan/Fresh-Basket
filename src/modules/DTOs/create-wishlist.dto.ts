import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateWishlistDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @IsString()
  @IsNotEmpty()
  productName: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  productPrice: number;
}
