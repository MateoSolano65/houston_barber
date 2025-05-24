import { Request } from 'express';
import {
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';

import { JwtService } from '@nestjs/jwt';

import { IS_PUBLIC_KEY } from '@common/decorators';
import { envs } from '@config/envs';

import { UNAUTHENTICATED_USER } from '@common/constants/auth.constants';

import { UsersService } from '@modules/users/users.service';
import { User } from '@modules/users/schemas/user.schema';

import { AuthService } from '../auth.service';
import { PayloadLogin } from '../interfaces/payload.interface';

@Injectable()
export class AuthGuard {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.isPublicRoute(context);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.authService.extractTokenFromRequest(request);

    const payload = await this.validateToken(token);

    const user = await this.usersService.findOne(payload.sub);

    this.assignRequestUser(user, request);

    return true;
  }

  private async validateToken(token: string): Promise<PayloadLogin> {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: envs.jwtSecret,
        ignoreExpiration: false,
      });
    } catch (error: unknown) {
      throw new UnauthorizedException((error as Error).message);
    }
  }

  private isPublicRoute(context: ExecutionContext): boolean {
    return this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
  }

  private assignRequestUser(user: User, request: Request): void {
    request.user = user;

    if (!request.user) {
      throw new InternalServerErrorException(UNAUTHENTICATED_USER);
    }
  }
}
