import { IsInt, IsString, IsOptional } from 'class-validator';

export class PlaceOrderDto {
  @IsInt()
  userId: number;

  @IsString()
  paymentMethod: string;

  @IsString()
  deliveryAddress: string;

  @IsString()
  phoneNumber: string;

  @IsOptional()
  @IsString()
  deliveryInstructions?: string;
}
