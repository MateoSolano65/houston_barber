import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { AdminRepository } from './repositories/admin.repository';
import { UsersService } from '../users/users.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { PaginationDto } from '@common/dto/pagination.dto';

@Injectable()
export class AdminsService {
  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly usersService: UsersService,
  ) {}

  async create(createAdminDto: CreateAdminDto) {
    try {
      // Create the user first
      const user = await this.usersService.create(createAdminDto.user);

      // Create the admin associated with the user
      const admin = await this.adminRepository.create({
        userId: user._id,
        creationDate: new Date(),
      });

      return {
        ...admin.toObject(),
        user,
      };
    } catch (error) {
      throw new BadRequestException(`Error creating admin: ${error.message}`);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const options = {
      populate: { path: 'userId' },
    };
    return this.adminRepository.findPaginate(paginationDto, options);
  }

  async findOne(id: string) {
    try {
      const isValidId = Types.ObjectId.isValid(id);
      if (!isValidId) {
        throw new BadRequestException('Invalid MongoDB ID');
      }

      const admin = await this.adminRepository.findOne({ _id: id }, { path: 'userId' });
      if (!admin) {
        throw new NotFoundException(`Admin with ID ${id} not found`);
      }

      return admin;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Error retrieving admin: ${error.message}`);
    }
  }

  async findByUserId(userId: string) {
    try {
      const isValidId = Types.ObjectId.isValid(userId);
      if (!isValidId) {
        throw new BadRequestException('Invalid MongoDB ID');
      }

      const admin = await this.adminRepository.findOne({ userId }, { path: 'userId' });
      if (!admin) {
        throw new NotFoundException(`Admin with user ID ${userId} not found`);
      }

      return admin;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Error retrieving admin: ${error.message}`);
    }
  }

  async update(id: string, updateAdminDto: UpdateAdminDto) {
    try {
      const isValidId = Types.ObjectId.isValid(id);
      if (!isValidId) {
        throw new BadRequestException('Invalid MongoDB ID');
      }

      // Check if admin exists
      const admin = await this.adminRepository.findOne({ _id: id });
      if (!admin) {
        throw new NotFoundException(`Admin with ID ${id} not found`);
      }

      // Update user if needed
      if (updateAdminDto.user) {
        await this.usersService.update(admin.userId.toString(), updateAdminDto.user);
      }

      return { message: 'Admin updated successfully' };
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Error updating admin: ${error.message}`);
    }
  }

  async remove(id: string) {
    try {
      const isValidId = Types.ObjectId.isValid(id);
      if (!isValidId) {
        throw new BadRequestException('Invalid MongoDB ID');
      }

      // Check if admin exists
      const admin = await this.adminRepository.findOne({ _id: id });
      if (!admin) {
        throw new NotFoundException(`Admin with ID ${id} not found`);
      }

      // Delete user (this will cascade delete the admin)
      await this.usersService.remove(admin.userId.toString());

      return { message: 'Admin deleted successfully' };
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Error deleting admin: ${error.message}`);
    }
  }
}
