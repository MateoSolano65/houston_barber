import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { EntityRepository } from '@common/database/entity.repository';
import { User } from '../schemas/user.schema';

@Injectable()
export class UserRepository extends EntityRepository<User> {
  constructor(@InjectModel(User.name) userModel: PaginateModel<User>) {
    super(userModel);
  }
}
