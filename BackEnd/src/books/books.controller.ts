import { Controller, Get, Param, Patch, Post, ParseIntPipe, Body, Delete, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { BookService } from './books.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserRole } from '../common/enums/user-role.enum';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { UsersService } from '../users/users.service';

@Controller('books')
export class BooksController {
  constructor(private readonly bookService: BookService, private readonly userService: UsersService) {}
    private ensureAdmin(role: UserRole, action: string) {
    if (role !== UserRole.ADMIN) {
      throw new ForbiddenException(`Only administrators can ${action} books`);
    }
  }
  @Get()
  findAll() {
      return this.bookService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
      return this.bookService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req, @Body() bookData: CreateBookDto) {
      this.ensureAdmin(req.user.role, 'create');
      return this.bookService.create(bookData);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
      @Req() req,
      @Param('id', ParseIntPipe) id: number,
      @Body() bookData: UpdateBookDto,
  ) {
      this.ensureAdmin(req.user.role, 'update');
      return this.bookService.update(id, bookData);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Req() req, @Param('id', ParseIntPipe) id: number) {
        this.ensureAdmin(req.user.role, 'delete');
      return this.bookService.delete(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/borrow')
  borrowBook(
      @Req() req,
      @Param('id', ParseIntPipe) id: number,
  ) {
      return this.userService.borrowBook(id, req.user.userId);
  }

@UseGuards(JwtAuthGuard)
  @Patch(':id/return')
  returnBook(
      @Req() req,
      @Param('id', ParseIntPipe) id: number,
  ) {
      return this.userService.returnBook(id, req.user.userId);
  }
}