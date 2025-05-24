import { APP_FILTER, APP_GUARD, APP_PIPE } from '@nestjs/core';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { MongooseModule } from '@nestjs/mongoose';

import { MongooseConfigService } from '@config/db';

import { LoggerMiddleware } from '@common/middlewares';
import { ParseMongoIdPipe } from '@common/pipes';
import { HttpExceptionFilter } from '@common/exceptions';

import { UsersModule } from '@modules/users/users.module';
import { AuthModule } from '@modules/auth/auth.module';
import { EmployeesModule } from '@modules/employees/employees.module';
import { AuthGuard } from './modules/auth/guards/auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({ useClass: MongooseConfigService }),
    UsersModule,
    EmployeesModule,
    AuthModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_PIPE, useClass: ParseMongoIdPipe },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('{*splat}');
  }
}
