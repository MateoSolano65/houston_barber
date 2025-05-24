import { User } from '@modules/users/schemas/user.schema';

export interface ResponseAuth {
  token: string;
  user: User;
}
