import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteFromCartDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  productId: string;
}
