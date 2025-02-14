import { Controller, Get, Patch, Param, Body, Post, UseGuards, UploadedFile, UseInterceptors, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateRoleDto } from '../modules/DTOs/update-role.dto';
import { AddUserDto } from '../modules/DTOs/add-user.dto';
import { UpdateProfileDto } from '../modules/DTOs/update-profile.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';

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

  // ✅ Get User Profile
  @Get('/profile/:id')
  async getUserProfile(@Param('id') id: number) {
    return this.userService.getUserProfile(id);
  }

  // ✅ Update User Profile (with Profile Picture Upload)
  @Patch('/profile/update/:id')
  @UseInterceptors(
    FileInterceptor('profilePicture', {
      storage: diskStorage({
        destination: './uploads/profile_pictures',
        filename: async (req, file, cb) => {
          const userId = req.params.id;
          const ext = path.extname(file.originalname);
          cb(null, `profile-${userId}${ext}`); // ✅ Name file as "profile-{id}.jpg"
        },
      }),
    }),
  )
  async updateProfile(
    @Param('id') id: number,
    @Body() updateProfileDto: UpdateProfileDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.updateProfile(id, updateProfileDto, file);
  }

  @Delete('remove/:id')
  @Roles('admin')
  async removeUser(@Param('id') id: number): Promise<string> {
    return this.userService.removeUser(id);
  }
}
