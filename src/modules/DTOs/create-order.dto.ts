import {
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsIn,
    IsDate,
    IsPositive,
  } from 'class-validator';
  import { Type } from 'class-transformer';
  
  export class CreateOrderDto {
    @IsNumber()
    @IsNotEmpty()
    userId: number;
  
    @IsString()
    @IsNotEmpty()
    @IsIn(['credit_card', 'debit_card', 'digital_wallet', 'cash_on_delivery'])
    paymentMethod: string;
  
    @IsString()
    @IsNotEmpty()
    @IsIn(['pending', 'processing', 'completed', 'cancelled'])
    status: string;
  
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    @IsNotEmpty()
    totalPrice: number;
  
    @IsString()
    @IsNotEmpty()
    deliveryAddress: string;
  
    @IsDate()
    @IsOptional()
    @Type(() => Date) // Transform input to a Date instance
    deliveryDate?: Date;
  }
  