import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { UserRoles } from '../enums';

export const ROLES_KEY = 'roles';
type RolesValues = (keyof typeof UserRoles)[];

export const Roles = (...roles: RolesValues): CustomDecorator<string> =>
  SetMetadata(ROLES_KEY, [UserRoles.ADMIN, ...roles]);

export const AllRoles = (): CustomDecorator<string> =>
  SetMetadata(ROLES_KEY, Object.values(UserRoles));
