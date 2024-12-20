import { Controller, Get, Patch, Param, Body, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateRoleDto } from '../modules/DTOs/update-role.dto';
import { AddUserDto } from '../modules/DTOs/add-user.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard) 
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/add')
  @Roles('admin')
  async addUser(@Body() addUserDto: AddUserDto): Promise<string> {
    return this.userService.addUser(addUserDto);
  }

  @Get('/getall')
  @Roles('admin') 
  async findAll(): Promise<any[]> {
    return this.userService.findAll();
  }

  @Post('update-role/:id')
  @Roles('admin') 
  async updateUserRole(
    @Param('id') id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<string> {
    return this.userService.updateUserRole(id, updateRoleDto.role);
  }
}
