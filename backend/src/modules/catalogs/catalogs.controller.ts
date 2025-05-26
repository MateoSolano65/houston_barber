import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';

import { PaginationDto } from '@common/dto';
import { Public, Roles } from '@common/decorators';

import { CreateCatalogDto, UpdateCatalogDto } from './dto';

import { CatalogsService } from './catalogs.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('catalogs')
@Controller('catalogs')
export class CatalogsController {
  constructor(private readonly catalogsService: CatalogsService) {}

  @Post()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Create a new catalog' })
  async create(@Body() createCatalogDto: CreateCatalogDto) {
    return await this.catalogsService.create(createCatalogDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all catalogs with pagination' })
  @ApiResponse({ status: 200, description: 'List of catalogs' })
  async findAll(@Query() paginationDto: PaginationDto) {
    return await this.catalogsService.findAll(paginationDto);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get a catalog by ID' })
  @ApiResponse({ status: 200, description: 'Catalog found' })
  @ApiResponse({ status: 404, description: 'Catalog not found' })
  async findOne(@Param('id') id: string) {
    return await this.catalogsService.findOneById(id);
  }

  @Roles('ADMIN')
  @Patch(':id')
  @ApiOperation({ summary: 'Update a catalog' })
  @ApiResponse({ status: 200, description: 'Catalog updated successfully' })
  @ApiResponse({ status: 404, description: 'Catalog not found' })
  async update(@Param('id') id: string, @Body() updateCatalogDto: UpdateCatalogDto) {
    return await this.catalogsService.update(id, updateCatalogDto);
  }

  @Roles('ADMIN')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a catalog' })
  @ApiResponse({ status: 200, description: 'Catalog deleted successfully' })
  @ApiResponse({ status: 404, description: 'Catalog not found' })
  async remove(@Param('id') id: string) {
    return await this.catalogsService.remove(id);
  }
}
