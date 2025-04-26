import { Injectable, NotImplementedException } from '@nestjs/common';
import * as crypto from 'crypto';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class UsersService {
  constructor() {}

  // Simple hash function for demo purposes only
  // In production, use a proper password hashing library
  private hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex');
  }

  async create(createUserDto: CreateUserDto) {
    const { password, ...rest } = createUserDto;

    throw new NotImplementedException('User creation not implemented yet.');
  }

  async findAll(paginationDto: PaginationDto) {
    throw new NotImplementedException('User retrieval not implemented yet.');
  }

  async findOne(id: string) {
    throw new NotImplementedException('User retrieval by ID not implemented yet.');
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    throw new NotImplementedException('User update not implemented yet.');
  }

  async remove(id: string) {
    throw new NotImplementedException('User deletion not implemented yet.');
  }
}
