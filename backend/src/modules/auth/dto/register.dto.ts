import { IsEmail, IsOptional, IsPhoneNumber, IsString, MinLength } from 'class-validator';

import { IsNotBlank } from '@common/decorators';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsNotBlank()
  name: string;

  @IsNotBlank()
  @MinLength(6)
  password: string;

  @IsPhoneNumber()
  phone: string;

  @IsString()
  @IsOptional()
  address?: string;
}
