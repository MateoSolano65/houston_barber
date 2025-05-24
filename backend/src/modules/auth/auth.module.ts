import { Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';

import { envs } from '@config/envs';

import { UsersModule } from '../users/users.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: envs.jwtSecret,
      signOptions: { expiresIn: envs.jwtExpiresIn },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
