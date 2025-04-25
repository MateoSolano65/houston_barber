import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  // Simple hash function for demo purposes only
  // In production, use a proper password hashing library
  private hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex');
  }

  async create(createUserDto: CreateUserDto) {
    const { password, ...rest } = createUserDto;
    
    // Save user with hashed password
    const user = await this.prisma.user.create({
      data: {
        ...rest,
        password: this.hashPassword(password),
      },
    });

    // Don't return the password
    const { password: _, ...result } = user;
    return result;
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          // Exclude password
        },
      }),
      this.prisma.user.count(),
    ]);

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        // Exclude password
      },
    });

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { password, ...rest } = updateUserDto;

    // Create a properly typed data object that includes password
    const data: Partial<UpdateUserDto> & { password?: string } = { ...rest };

    // Hash password if provided
    if (password) {
      data.password = this.hashPassword(password);
    }

    const user = await this.prisma.user.update({
      where: { id },
      data,
    });

    // Don't return the password
    const { password: _, ...result } = user;
    return result;
  }

  async remove(id: string) {
    await this.prisma.user.delete({
      where: { id },
    });

    return { success: true };
  }
}