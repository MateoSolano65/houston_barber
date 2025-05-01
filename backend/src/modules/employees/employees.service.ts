import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { EmployeeRepository } from './repositories/employee.repository';
import { UsersService } from '../users/users.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { PaginationDto } from '@common/dto/pagination.dto';
import { UserRoles } from '@common/enums/app.enums';

@Injectable()
export class EmployeesService {
  constructor(
    private readonly employeeRepository: EmployeeRepository,
    private readonly usersService: UsersService,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto) {
    try {
      // Asegurar que el rol sea EMPLOYEE
      const userData = {
        ...createEmployeeDto.user,
        role: UserRoles.EMPLOYEE, // Forzar el rol a EMPLOYEE independientemente del valor recibido
      };

      // Create the user first
      const user = await this.usersService.create(userData);

      // Create the employee associated with the user
      const employee = await this.employeeRepository.create({
        userId: user._id,
        specialty: createEmployeeDto.specialty,
        phone: createEmployeeDto.user.phone,
        schedule: createEmployeeDto.schedule || {},
      });

      return {
        ...employee.toObject(),
        user,
      };
    } catch (error) {
      throw new BadRequestException(`Error creating employee: ${error.message}`);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const options = {
      populate: { path: 'userId' },
    };
    return this.employeeRepository.findPaginate(paginationDto, options);
  }

  async findOne(id: string) {
    try {
      const isValidId = Types.ObjectId.isValid(id);
      if (!isValidId) {
        throw new BadRequestException('Invalid MongoDB ID');
      }

      // Obtener el empleado por ID sin poblar inicialmente
      const employee = await this.employeeRepository.findOneById(id);
      
      if (!employee) {
        throw new NotFoundException(`Employee with ID ${id} not found`);
      }

      // Poblar manualmente el campo userId con una consulta separada
      const populatedEmployee = employee.toObject();
      
      // Obtener los datos del usuario asociado
      const user = await this.usersService.findOne(employee.userId.toString());
      
      // Reemplazar el userId con el objeto de usuario completo
      populatedEmployee.user = user;

      // Devolver el objeto completo con usuario poblado
      return populatedEmployee;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Error retrieving employee: ${error.message}`);
    }
  }

  // async findByUserId(userId: string) {
  //   try {
  //     const isValidId = Types.ObjectId.isValid(userId);
  //     if (!isValidId) {
  //       throw new BadRequestException('Invalid MongoDB ID');
  //     }

  //     const employee = await this.employeeRepository.findOne({ userId }, { path: 'userId' });
  //     if (!employee) {
  //       throw new NotFoundException(`Employee with user ID ${userId} not found`);
  //     }

  //     return employee;
  //   } catch (error) {
  //     if (error instanceof BadRequestException || error instanceof NotFoundException) {
  //       throw error;
  //     }
  //     throw new BadRequestException(`Error retrieving employee: ${error.message}`);
  //   }
  // }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    try {
      const isValidId = Types.ObjectId.isValid(id);
      if (!isValidId) {
        throw new BadRequestException('Invalid MongoDB ID');
      }

      // Check if employee exists
      const employee = await this.employeeRepository.findOne({ _id: id });
      if (!employee) {
        throw new NotFoundException(`Employee with ID ${id} not found`);
      }

      // Update user if needed
      if (updateEmployeeDto.user) {
        // Asegurar que el rol sea EMPLOYEE incluso al actualizar
        const userData = {
          ...updateEmployeeDto.user,
          role: UserRoles.EMPLOYEE,
        };
        await this.usersService.update(employee.userId.toString(), userData);
      }

      // Update employee fields
      const { user, ...employeeData } = updateEmployeeDto;
      if (Object.keys(employeeData).length > 0) {
        await this.employeeRepository.findOneAndUpdate({ _id: id }, employeeData);
      }

      return { message: 'Employee updated successfully' };
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Error updating employee: ${error.message}`);
    }
  }

  async remove(id: string) {
    try {
      const isValidId = Types.ObjectId.isValid(id);
      if (!isValidId) {
        throw new BadRequestException('Invalid MongoDB ID');
      }

      // Check if employee exists
      const employee = await this.employeeRepository.findOne({ _id: id });
      if (!employee) {
        throw new NotFoundException(`Employee with ID ${id} not found`);
      }

      // Delete user (this will cascade delete the employee)
      await this.usersService.remove(employee.userId.toString());

      // Delete employee
      await this.employeeRepository.findOneAndDelete({ _id: id });


      console.log(`Employee with ID ${id} has been deleted.`);

      return { message: 'Employee deleted successfully' };
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Error deleting employee: ${error.message}`);
    }
  }
}
