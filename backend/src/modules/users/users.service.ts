import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Types } from 'mongoose';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '@common/dto/pagination.dto';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  // Hash password securely with bcrypt
  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async create(createUserDto: CreateUserDto) {
    try {
      // Check if user with email exists
      const exists = await this.userRepository.findOne({ email: createUserDto.email });
      if (exists) {
        throw new BadRequestException(`User with email ${createUserDto.email} already exists`);
      }

      const { password, ...userData } = createUserDto;

      // Create new user with hashed password
      const hashedPassword = await this.hashPassword(password);
      return this.userRepository.create({
        ...userData,
        password: hashedPassword,
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Error creating user: ${error.message}`);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    return this.userRepository.findPaginate({}, paginationDto);
  }

  async findOne(id: string) {
    try {
      const isValidId = Types.ObjectId.isValid(id);
      if (!isValidId) {
        throw new BadRequestException('Invalid MongoDB ID');
      }

      const user = await this.userRepository.findOne({ _id: id });
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return user;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Error retrieving user: ${error.message}`);
    }
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({ email });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const isValidId = Types.ObjectId.isValid(id);
      if (!isValidId) {
        throw new BadRequestException('Invalid MongoDB ID');
      }

      // Check if user exists
      const user = await this.userRepository.findOne({ _id: id });
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      // If updating password, hash it
      if (updateUserDto.password) {
        updateUserDto.password = await this.hashPassword(updateUserDto.password);
      }

      // Update user
      await this.userRepository.findOneAndUpdate({ _id: id }, updateUserDto);
      return { message: 'User updated successfully' };
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Error updating user: ${error.message}`);
    }
  }

  async remove(id: string) {
    try {
      const isValidId = Types.ObjectId.isValid(id);
      if (!isValidId) {
        throw new BadRequestException('Invalid MongoDB ID');
      }

      // Check if user exists
      const user = await this.userRepository.findOne({ _id: id });
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      // Delete user
      await this.userRepository.findOneAndDelete({ _id: id });
      return { message: 'User deleted successfully' };
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Error deleting user: ${error.message}`);
    }
  }

  async validatePassword(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainTextPassword, hashedPassword);
  }
}
