import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('signup')
  async signup(@Body() createUserDto: any) {
    return this.authService.signup(createUserDto);
  }
  @HttpCode(HttpStatus.OK) 
  @Post('login')
  async login(@Body() loginDto: any) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    
    return this.authService.login(user);
  }
}