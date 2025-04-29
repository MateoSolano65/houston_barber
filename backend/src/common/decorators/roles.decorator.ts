import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { Role } from '../enums/roles.enum';

export const ROLES_KEY = 'roles';
type RolesValues = (keyof typeof Role)[];

export const Roles = (...roles: RolesValues): CustomDecorator<string> =>
  SetMetadata(ROLES_KEY, [Role.Admin, ...roles]);

export const AllRoles = (): CustomDecorator<string> => SetMetadata(ROLES_KEY, Object.values(Role));
