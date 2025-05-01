import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { PaginationDto } from '@common/dto/pagination.dto';
import { ParseMongoIdPipe } from '@common/pipes/parse-mongo-id.pipe';

@ApiTags('employees')
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new employee (barber)' })
  @ApiResponse({ status: 201, description: 'Employee successfully created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.create(createEmployeeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all employees with pagination' })
  @ApiResponse({ status: 200, description: 'List of employees' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.employeesService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an employee by ID' })
  @ApiResponse({ status: 200, description: 'Employee found' })
  @ApiResponse({ status: 404, description: 'Employee not found' })
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.employeesService.findOne(id);
  }

  // @Get('user/:userId')
  // @ApiOperation({ summary: 'Get an employee by user ID' })
  // @ApiResponse({ status: 200, description: 'Employee found' })
  // @ApiResponse({ status: 404, description: 'Employee not found' })
  // findByUserId(@Param('userId', ParseMongoIdPipe) userId: string) {
  //   return this.employeesService.findByUserId(userId);
  // }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an employee' })
  @ApiResponse({ status: 200, description: 'Employee updated successfully' })
  @ApiResponse({ status: 404, description: 'Employee not found' })
  update(@Param('id', ParseMongoIdPipe) id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    return this.employeesService.update(id, updateEmployeeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an employee' })
  @ApiResponse({ status: 200, description: 'Employee deleted successfully' })
  @ApiResponse({ status: 404, description: 'Employee not found' })
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.employeesService.remove(id);
  }
}
