import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRoles } from '@common/enums/app.enums';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'Cliente', enum: UserRoles, default: UserRoles.CLIENT })
  @IsEnum(UserRoles)
  @IsNotEmpty()
  role: UserRoles = UserRoles.CLIENT;

  @ApiProperty({ example: '+573001234567' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: '123 Main St, City, Country' })
  @IsString()
  @IsOptional()
  address?: string;
}
