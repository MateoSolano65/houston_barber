import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { EmployeeRepository } from './repositories/employee.repository';
import { Employee, EmployeeSchema } from './schemas/employee.schema';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Employee.name, schema: EmployeeSchema }]),
    UsersModule,
  ],
  controllers: [EmployeesController],
  providers: [EmployeesService, EmployeeRepository],
  exports: [EmployeesService],
})
export class EmployeesModule {}
