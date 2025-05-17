import { Request } from 'express';

import { User } from '@modules/users/schemas/user.schema';

export const extractUserFromRequest = (request: Request): User => {
  return request.user as User;
};
