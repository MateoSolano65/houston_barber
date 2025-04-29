import { Request } from 'express';

import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

import { IS_PUBLIC_KEY, ROLES_KEY } from '../decorators';

import { Role } from '../enums';
import { extractUserFromRequest } from '../helpers/user-request.helper';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const roles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles) return false;

    const request = context.switchToHttp().getRequest<Request>();
    const userRole = this.extractUserRole(request);
    const hasRole = this.hasValidRoles(roles, userRole);

    if (!hasRole) throw new UnauthorizedException();

    return true;
  }

  hasValidRoles(validRoles: Role[], userRole: Role): boolean {
    return validRoles.includes(userRole);
  }

  extractUserRole(request: Request): Role {
    return extractUserFromRequest(request).role;
  }
}
