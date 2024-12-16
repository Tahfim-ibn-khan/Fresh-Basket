import { IsOptional, IsString, IsNumber, IsDate, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchOrderDto {
  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  minTotalPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxTotalPrice?: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;
}
