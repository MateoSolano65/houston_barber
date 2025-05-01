import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { EntityRepository } from '@common/database/entity.repository';
import { Employee } from '../schemas/employee.schema';

@Injectable()
export class EmployeeRepository extends EntityRepository<Employee> {
  constructor(@InjectModel(Employee.name) employeeModel: PaginateModel<Employee>) {
    super(employeeModel);
  }
}
