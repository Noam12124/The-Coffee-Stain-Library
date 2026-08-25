import { Controller, Get, Post, Body, Param, ParseIntPipe, Patch, Req, UseGuards } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller('users') 
export class UsersController {
  constructor(
    private readonly authService: AuthService, 
    private readonly usersService: UsersService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Patch(':id/borrow')
  borrowBook(
      @Req() req,
      @Param('id', ParseIntPipe) id: number,
  ) {
      return this.usersService.borrowBook(id, req.user.userId);
  }
 
  @UseGuards(JwtAuthGuard)
  @Patch(':id/return')
  returnBook(
      @Req() req,
      @Param('id', ParseIntPipe) id: number,
  ) {
      return this.usersService.returnBook(id, req.user.userId);
  }
}