import {IsNotEmpty, IsString, MinLength } from 'class-validator'; 
import { LoginDto } from './login.dto';


export class SignupDto extends LoginDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name!: string;
}