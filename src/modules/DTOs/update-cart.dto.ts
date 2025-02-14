import { IsInt, Min } from 'class-validator';

export class UpdateCartDto {
  @IsInt()
  userId: number;

  @IsInt()
  cartId: number;

  @IsInt()
  @Min(0)
  quantity: number;
}
