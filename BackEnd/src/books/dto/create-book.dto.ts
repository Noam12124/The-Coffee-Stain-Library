import { IsOptional, IsString, IsNotEmpty} from 'class-validator';


export class CreateBookDto {

    @IsString()
    @IsNotEmpty()
    title!: string;

    @IsString()
    @IsNotEmpty()
    author!: string;

    @IsString()
    @IsOptional()
    imageUrl!: string;
}
