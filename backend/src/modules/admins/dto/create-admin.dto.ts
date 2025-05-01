import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateUserDto } from '@modules/users/dto/create-user.dto';
import { UserRoles } from '@common/enums/app.enums';

export class CreateAdminDto {
  @ApiProperty({ description: 'User information' })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateUserDto)
  user: CreateUserDto = {
    email: '',
    name: '',
    password: '',
    role: UserRoles.ADMIN,
  };
}
