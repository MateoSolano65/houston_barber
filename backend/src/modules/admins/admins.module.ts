import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AdminsController } from './admins.controller';
import { AdminsService } from './admins.service';
import { AdminRepository } from './repositories/admin.repository';
import { Admin, AdminSchema } from './schemas/admin.schema';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]), UsersModule],
  controllers: [AdminsController],
  providers: [AdminsService, AdminRepository],
  exports: [AdminsService],
})
export class AdminsModule {}
