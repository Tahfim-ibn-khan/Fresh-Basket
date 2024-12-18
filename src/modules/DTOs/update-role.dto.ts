import { IsIn, IsNotEmpty } from 'class-validator';

export class UpdateRoleDto {
  @IsNotEmpty()
  @IsIn(['admin', 'customer', 'delivery-agent', 'store manager'])
  role: string;
}
