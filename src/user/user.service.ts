import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { AddUserDto } from '../modules/DTOs/add-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Add a new user
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

  // Retrieve all users
  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  // Update a user's role by ID
  async updateUserRole(id: number, role: string): Promise<string> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }

    user.role = role;
    await this.userRepository.save(user);

    return 'User role updated successfully!';
  }
}
