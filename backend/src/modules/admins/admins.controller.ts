import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { PaginationDto } from '@common/dto/pagination.dto';
import { ParseMongoIdPipe } from '@common/pipes/parse-mongo-id.pipe';

@ApiTags('admins')
@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new administrator' })
  @ApiResponse({ status: 201, description: 'Administrator successfully created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminsService.create(createAdminDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all administrators with pagination' })
  @ApiResponse({ status: 200, description: 'List of administrators' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.adminsService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an administrator by ID' })
  @ApiResponse({ status: 200, description: 'Administrator found' })
  @ApiResponse({ status: 404, description: 'Administrator not found' })
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.adminsService.findOne(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get an administrator by user ID' })
  @ApiResponse({ status: 200, description: 'Administrator found' })
  @ApiResponse({ status: 404, description: 'Administrator not found' })
  findByUserId(@Param('userId', ParseMongoIdPipe) userId: string) {
    return this.adminsService.findByUserId(userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an administrator' })
  @ApiResponse({ status: 200, description: 'Administrator updated successfully' })
  @ApiResponse({ status: 404, description: 'Administrator not found' })
  update(@Param('id', ParseMongoIdPipe) id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminsService.update(id, updateAdminDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an administrator' })
  @ApiResponse({ status: 200, description: 'Administrator deleted successfully' })
  @ApiResponse({ status: 404, description: 'Administrator not found' })
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.adminsService.remove(id);
  }
}
