import { Injectable, NotFoundException } from '@nestjs/common';

import { PaginationDto } from '@common/dto';

import { CreateCatalogDto, UpdateCatalogDto } from './dto';

import { CatalogRepository } from './repositories/catalog.repository';
import { CatalogDocument } from './schemas/catalog.schema';

@Injectable()
export class CatalogsService {
  constructor(private readonly catalogRepository: CatalogRepository) {}

  async create(createCatalogDto: CreateCatalogDto): Promise<CatalogDocument> {
    return await this.catalogRepository.create(createCatalogDto);
  }

  async findAll(paginationDto: PaginationDto) {
    return await this.catalogRepository.findPaginate(paginationDto);
  }

  async findOneById(id: string): Promise<CatalogDocument> {
    const catalog = await this.catalogRepository.findOneById(id);

    if (!catalog) throw new NotFoundException(`Catalog not found`);

    return catalog;
  }

  async update(id: string, updateCatalogDto: UpdateCatalogDto): Promise<CatalogDocument> {
    const catalogUpdated = await this.catalogRepository.findOneAndUpdate(
      { _id: id },
      updateCatalogDto,
      { new: true },
    );

    if (!catalogUpdated) throw new NotFoundException(`Catalog not found`);

    return catalogUpdated;
  }

  async remove(id: string): Promise<CatalogDocument> {
    const catalogDeleted = await this.catalogRepository.findOneAndDelete({ _id: id });

    if (!catalogDeleted) throw new NotFoundException(`Catalog not found`);

    return catalogDeleted;
  }
}
