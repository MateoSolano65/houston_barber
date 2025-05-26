import { IsInt, IsNumber, IsPositive } from 'class-validator';

import { IsNotBlank } from '@common/decorators';

export class CreateCatalogDto {
  @IsNotBlank()
  name: string;

  @IsNotBlank()
  description: string;

  @IsNumber()
  @IsInt()
  @IsPositive()
  duration: number;

  @IsNumber()
  @IsInt()
  @IsPositive()
  price: number;
}
