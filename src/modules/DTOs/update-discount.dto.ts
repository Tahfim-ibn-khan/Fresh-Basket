import { IsNumber, Min, Max, IsNotEmpty } from 'class-validator';

export class UpdateDiscountDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(100)
  discount: number;
}
