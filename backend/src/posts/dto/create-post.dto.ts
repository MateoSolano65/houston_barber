import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ example: 'My First Post' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'This is the content of my first post' })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({ example: true, default: false })
  @IsBoolean()
  @IsOptional()
  published?: boolean;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  @IsNotEmpty()
  authorId: string;
}