import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { AddUserDto } from '../modules/DTOs/add-user.dto';
import { UpdateProfileDto } from '../modules/DTOs/update-profile.dto';
import { v2 as cloudinary } from 'cloudinary';
import * as bcrypt from "bcrypt";



@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    cloudinary.config({
      cloud_name: 'dquhmyg3y',
      api_key: '339583574244771',
      api_secret: 'UoUKPOUzhxoWFs_yiTKHzoNLRc4',
    });
  }

  async addUser(addUserDto: AddUserDto): Promise<string> {
    const { name, email, password, role } = addUserDto;

    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('User with this email already exists.');
    }

    const newUser = this.userRepository.create({ name, email, password, role });
    await this.userRepository.save(newUser);

    return 'User successfully added!';
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async updateUserRole(id: number, role: string): Promise<string> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }

    user.role = role;
    await this.userRepository.save(user);

    return 'User role updated successfully!';
  }

  async getUserProfile(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    if (!user.profilePicture) {
      user.profilePicture = "https://res.cloudinary.com/dquhmyg3y/image/upload/v1700000000/default-profile.png";
    }

    return user;
  }

  async updateProfile(id: number, updateProfileDto: UpdateProfileDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException("User not found.");
    }
  
    if (updateProfileDto.name) user.name = updateProfileDto.name;
  
    if (updateProfileDto.password) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(updateProfileDto.password, saltRounds);
      user.password = hashedPassword;
    }
  
    if (updateProfileDto.profilePicture) {
      user.profilePicture = updateProfileDto.profilePicture;
    }
  
    await this.userRepository.save(user);
  
    return { message: "Profile updated successfully!", profilePicture: user.profilePicture };
  }

  async removeUser(id: number): Promise<string> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found.`);
      }
  
      await this.userRepository.delete(id);
      return 'User removed successfully!';
    } catch (error) {
      console.error("❌ Error removing user:", error);
      throw new InternalServerErrorException("Failed to remove user. Please try again.");
    }
  }
  
}
