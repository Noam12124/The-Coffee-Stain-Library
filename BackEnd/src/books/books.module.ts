import { Module } from '@nestjs/common';
import { BooksController } from './books.controller';
import { BookService } from './books.service';
import { BookRepository } from './books.repository';

@Module({
    controllers: [BooksController],
    providers: [BookService, BookRepository],
    exports: [BookRepository],
})
export class BooksModule {}
