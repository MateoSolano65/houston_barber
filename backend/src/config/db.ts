import { Injectable } from '@nestjs/common';
import { MongooseModuleOptions, MongooseOptionsFactory } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

import paginate from 'mongoose-paginate-v2';

import { envs } from './envs';

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: envs.dbUrl,
      connectionFactory: (connection: Connection) => {
        connection.plugin(paginate);
        return connection;
      },
    };
  }
}
