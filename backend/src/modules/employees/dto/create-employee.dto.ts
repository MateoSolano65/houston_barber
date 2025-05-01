import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateUserDto } from '@modules/users/dto/create-user.dto';
import { UserRoles } from '@common/enums/app.enums';

export class CreateEmployeeDto {
  @ApiProperty({ description: 'User information' })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateUserDto)
  user: CreateUserDto = {
    email: '',
    name: '',
    password: '',
    role: UserRoles.EMPLOYEE,
    phone: '',
    address: undefined,
  };

  @ApiProperty({ example: 'Barbero' })
  @IsString()
  @IsNotEmpty()
  specialty: string;

  @ApiProperty({ example: { monday: '8:00-17:00', tuesday: '8:00-17:00' } })
  @IsOptional()
  schedule?: Record<string, any>;
}
