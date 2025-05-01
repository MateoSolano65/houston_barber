import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { EntityRepository } from '@common/database/entity.repository';
import { Client } from '../schemas/client.schema';

@Injectable()
export class ClientRepository extends EntityRepository<Client> {
  constructor(@InjectModel(Client.name) clientModel: PaginateModel<Client>) {
    super(clientModel);
  }
}
