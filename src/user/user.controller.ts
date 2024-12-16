import { Controller, Get, Patch, Param, Body, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateRoleDto } from '../modules/DTOs/update-role.dto';
import { AddUserDto } from '../modules/DTOs/add-user.dto';
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('/add')
  async addUser(@Body() addUserDto: AddUserDto): Promise<string> {
    return this.userService.addUser(addUserDto);
  }



  @Get('/getall')
  async findAll(): Promise<any[]> {
    return this.userService.findAll();
  }


    @Post('update-role/:id')
    async updateUserRole(
     @Param('id') id: number,
      @Body() updateRoleDto: UpdateRoleDto,
    ): Promise<string> {
    return this.userService.updateUserRole(id, updateRoleDto.role);
  }
}
