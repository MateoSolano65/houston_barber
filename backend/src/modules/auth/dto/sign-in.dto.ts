import { IsEmail } from 'class-validator';

import { IsNotBlank } from '@common/decorators';

export class SignInDto {
  @IsEmail()
  email: string;

  @IsNotBlank()
  password: string;
}
