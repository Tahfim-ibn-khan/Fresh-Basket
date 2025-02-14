import { Controller, Get, Patch, Param, Body, Post, UseGuards, UploadedFile, UseInterceptors, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateRoleDto } from '../modules/DTOs/update-role.dto';
import { AddUserDto } from '../modules/DTOs/add-user.dto';
import { UpdateProfileDto } from '../modules/DTOs/update-profile.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import * as multer from 'multer';

cloudinary.config({
  cloud_name: 'dquhmyg3y',
  api_key: '339583574244771',
  api_secret: 'UoUKPOUzhxoWFs_yiTKHzoNLRc4',
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    resource_type: 'image',
    public_id: `profile-${req.params.id}`,
    format: 'png',
    folder: 'profile_pictures',
  }),
});

const upload = multer({ storage });

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

  @Get('/profile/:id')
  async getUserProfile(@Param('id') id: number) {
    return this.userService.getUserProfile(id);
  }

  @Patch('/profile/update/:id')
  async updateProfile(
    @Param('id') id: number,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.userService.updateProfile(id, updateProfileDto);
  }

  @Delete('remove/:id')
  @Roles('admin')
  async removeUser(@Param('id') id: number): Promise<string> {
    return this.userService.removeUser(id);
  }
}
