import { Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findById(Number(id));
  }

  @Get('email/:email')
  findByEmail(@Param('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  @Post(':userId/borrow/:bookId')
  borrowBook(
    @Param('userId') userId: string,
    @Param('bookId') bookId: string,
  ) {
    return this.usersService.borrowBook(Number(userId), Number(bookId));
  }

  @Post(':userId/return/:bookId')
  returnBook(
    @Param('userId') userId: string,
    @Param('bookId') bookId: string,
  ) {
    return this.usersService.returnBook(Number(userId), Number(bookId));
  }
}