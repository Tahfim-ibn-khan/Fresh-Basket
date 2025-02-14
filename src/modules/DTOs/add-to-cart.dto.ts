import { IsInt, Min } from 'class-validator';

export class AddToCartDto {
  @IsInt()
  userId: number;

  @IsInt()
  productId: number;

  @IsInt()
  @Min(1)
  quantity: number;
}
