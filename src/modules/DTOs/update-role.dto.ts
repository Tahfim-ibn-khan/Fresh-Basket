import { IsIn, IsNotEmpty } from 'class-validator';

export class UpdateRoleDto {
  @IsNotEmpty()
  @IsIn(['Admin', 'Customer', 'Delivery Agent', 'Store Manager'])
  role: string;
}
