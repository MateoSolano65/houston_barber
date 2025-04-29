import { Request } from 'express';

export const extractUserFromRequest = (request: Request) => {
  return request.user;
};
