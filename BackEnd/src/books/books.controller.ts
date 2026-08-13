import { Controller, Get, Param, Patch, Post, ParseIntPipe } from '@nestjs/common';
import { BookService } from './books.service';

@Controller('books')
export class BooksController {
  constructor(private readonly bookService: BookService) {}
    @Get()
    findAll() {
        return this.bookService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.bookService.findById(id);
    }

    @Patch(':bookId/borrow/:userId')
    borrowBook(
        @Param('bookId', ParseIntPipe) bookId: number,
        @Param('userId', ParseIntPipe) userHoldingBook: number,
    ) {
        return this.bookService.updateUserHoldingBook(bookId, userHoldingBook);
    }
}