import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { AdminRepository } from './repositories/admin.repository';
import { UsersService } from '../users/users.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { PaginationDto } from '@common/dto/pagination.dto';
import { UserRoles } from '@common/enums/app.enums';

@Injectable()
export class AdminsService {
  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly usersService: UsersService,
  ) {}

  async create(createAdminDto: CreateAdminDto) {
    try {
      // Asegurarnos de que el rol sea Admin
      const adminUserData = {
        ...createAdminDto.user,
        role: UserRoles.ADMIN,
      };

      // Create the user first with the forced Admin role
      const user = await this.usersService.create(adminUserData);

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
    const paginatedResult = await this.adminRepository.findPaginate(paginationDto, options);

    // Transform response to rename 'docs' to 'admins'
    // and transform 'userId' to 'user'
    const { docs, ...paginationInfo } = paginatedResult;

    const transformedAdmins = docs.map(admin => {
      const adminObj = admin.toObject ? admin.toObject() : admin;
      const { userId, ...rest } = adminObj;

      return {
        ...rest,
        user: userId,
      };
    });

    return {
      admins: transformedAdmins,
      ...paginationInfo,
    };
  }

  async findByUserId(userId: string) {
    try {
      const isValidId = Types.ObjectId.isValid(userId);
      if (!isValidId) {
        throw new BadRequestException('Invalid MongoDB ID');
      }

      // Convert the userId to ObjectId for the search
      const objectId = new Types.ObjectId(userId);

      // First, we search for the admin without populate
      const admin = await this.adminRepository.findOne({ userId: objectId });

      if (!admin) {
        throw new NotFoundException(`Admin with user ID ${userId} not found`);
      }

      const user = await this.usersService.findOne(userId);

      // Transform the admin object to remove userId and include user
      const adminObj = admin.toObject();
      const { userId: _, ...rest } = adminObj;

      return {
        ...rest,
        user,
      };
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

      // Guardar el ID del usuario asociado
      const userId = admin.userId.toString();

      // Primero eliminar el documento del administrador
      await this.adminRepository.findOneAndDelete({ _id: id });

      // Luego eliminar el usuario asociado
      await this.usersService.remove(userId);

      return { message: 'Admin deleted successfully' };
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Error deleting admin: ${error.message}`);
    }
  }
}
