import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { EntityRepository } from '@common/database/entity.repository';
import { Admin } from '../schemas/admin.schema';

@Injectable()
export class AdminRepository extends EntityRepository<Admin> {
  constructor(@InjectModel(Admin.name) adminModel: PaginateModel<Admin>) {
    super(adminModel);
  }
}
