import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CreateUserDto } from '@modules/users/dto/create-user.dto';
import { UserRoles } from '@common/enums/app.enums';

export class CreateClientDto {
  @ApiProperty({ description: 'User information' })
  @IsNotEmpty()
  user: CreateUserDto = {
    email: '',
    name: '',
    password: '',
    role: UserRoles.CLIENT,
  };

  @ApiProperty({ example: '+573001234567' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: 'Calle 123 #45-67' })
  @IsString()
  @IsOptional()
  address?: string;
}
