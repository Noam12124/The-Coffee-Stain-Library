import { Controller, Get, Param, Patch, Post, ParseIntPipe, Body, Delete, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { BookService } from './books.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserRole } from '../users/users.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Controller('books')
export class BooksController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  findAll() {
      return this.bookService.findAll();
  }

  @Get('available')
  findAvailable() {
      return this.bookService.findAvailable();
  }

  @Get('borrowed')
  findBorrowed() {
      return this.bookService.findBorrowed();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
      return this.bookService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req, @Body() bookData: CreateBookDto) {
      if (req.user.role !== UserRole.ADMIN) {
          throw new ForbiddenException('Only administrators can create books');
      }
      return this.bookService.create(bookData);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
      @Req() req,
      @Param('id', ParseIntPipe) id: number,
      @Body() bookData: UpdateBookDto,
  ) {
      if (req.user.role !== UserRole.ADMIN) {
          throw new ForbiddenException('Only administrators can update books');
      }
      return this.bookService.update(id, bookData);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Req() req, @Param('id', ParseIntPipe) id: number) {
      if (req.user.role !== UserRole.ADMIN) {
          throw new ForbiddenException('Only administrators can delete books');
      }
      return this.bookService.delete(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/borrow')
  borrowBook(
      @Req() req,
      @Param('id', ParseIntPipe) id: number,
  ) {
      return this.bookService.borrowBook(id, req.user.userId);
  }

@UseGuards(JwtAuthGuard)
  @Patch(':id/return')
  returnBook(
      @Req() req,
      @Param('id', ParseIntPipe) id: number,
  ) {
      return this.bookService.returnBook(id, req.user.userId);
  }
}