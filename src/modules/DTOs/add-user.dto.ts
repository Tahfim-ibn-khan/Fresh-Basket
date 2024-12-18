import { IsEmail, IsNotEmpty, MinLength, IsIn } from 'class-validator';

export class AddUserDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsIn(['admin', 'customer', 'delivery-agent', 'store manager'])
  role: string;
}
