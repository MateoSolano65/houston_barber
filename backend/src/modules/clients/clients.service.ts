import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { ClientRepository } from './repositories/client.repository';
import { UsersService } from '../users/users.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { PaginationDto } from '@common/dto/pagination.dto';

@Injectable()
export class ClientsService {
  constructor(
    private readonly clientRepository: ClientRepository,
    private readonly usersService: UsersService,
  ) {}

  async create(createClientDto: CreateClientDto) {
    try {
      // Create the user first
      const user = await this.usersService.create(createClientDto.user);

      // Create the client associated with the user
      const client = await this.clientRepository.create({
        userId: user._id,
        phone: createClientDto.phone,
        address: createClientDto.address,
      });

      return {
        ...client.toObject(),
        user,
      };
    } catch (error) {
      throw new BadRequestException(`Error creating client: ${error.message}`);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const options = {
      populate: { path: 'userId' },
    };
    return this.clientRepository.findPaginate(paginationDto, options);
  }

  async findOne(id: string) {
    try {
      const isValidId = Types.ObjectId.isValid(id);
      if (!isValidId) {
        throw new BadRequestException('Invalid MongoDB ID');
      }

      const client = await this.clientRepository.findOne({ _id: id }, { path: 'userId' });
      if (!client) {
        throw new NotFoundException(`Client with ID ${id} not found`);
      }

      return client;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Error retrieving client: ${error.message}`);
    }
  }

  async findByUserId(userId: string) {
    try {
      const isValidId = Types.ObjectId.isValid(userId);
      if (!isValidId) {
        throw new BadRequestException('Invalid MongoDB ID');
      }

      const client = await this.clientRepository.findOne({ userId }, { path: 'userId' });
      if (!client) {
        throw new NotFoundException(`Client with user ID ${userId} not found`);
      }

      return client;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Error retrieving client: ${error.message}`);
    }
  }

  async update(id: string, updateClientDto: UpdateClientDto) {
    try {
      const isValidId = Types.ObjectId.isValid(id);
      if (!isValidId) {
        throw new BadRequestException('Invalid MongoDB ID');
      }

      // Check if client exists
      const client = await this.clientRepository.findOne({ _id: id });
      if (!client) {
        throw new NotFoundException(`Client with ID ${id} not found`);
      }

      // Update user if needed
      if (updateClientDto.user) {
        await this.usersService.update(client.userId.toString(), updateClientDto.user);
      }

      // Update client fields
      const { user, ...clientData } = updateClientDto;
      if (Object.keys(clientData).length > 0) {
        await this.clientRepository.findOneAndUpdate({ _id: id }, clientData);
      }

      return { message: 'Client updated successfully' };
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Error updating client: ${error.message}`);
    }
  }

  async remove(id: string) {
    try {
      const isValidId = Types.ObjectId.isValid(id);
      if (!isValidId) {
        throw new BadRequestException('Invalid MongoDB ID');
      }

      // Check if client exists
      const client = await this.clientRepository.findOne({ _id: id });
      if (!client) {
        throw new NotFoundException(`Client with ID ${id} not found`);
      }

      // Delete user (this will cascade delete the client)
      await this.usersService.remove(client.userId.toString());

      return { message: 'Client deleted successfully' };
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Error deleting client: ${error.message}`);
    }
  }
}
