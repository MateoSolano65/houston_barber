import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';

import { EntityRepository } from '@common/database/entity.repository';

import { Catalog, CatalogDocument } from '../schemas/catalog.schema';

@Injectable()
export class CatalogRepository extends EntityRepository<CatalogDocument> {
  constructor(@InjectModel(Catalog.name) catalogModel: PaginateModel<CatalogDocument>) {
    super(catalogModel);
  }
}
