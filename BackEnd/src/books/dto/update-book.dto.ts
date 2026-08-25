import { IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class UpdateBookDto {
  @IsOptional()
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  author!: string;

  @IsOptional()
  @IsString()
  imageUrl!: string;
}