
import { Injectable } from '@nestjs/common';
import { Book } from './books.entity';
import { BookRepository } from './books.repository';

@Injectable()
export class BookService {
    constructor(private readonly bookRepository: BookRepository) {}

    findAll(): Book[] {
        return this.bookRepository.findAll();
    }

    findById(id: number): Book | undefined {
        return this.bookRepository.findById(id);
    }
    updateUserHoldingBook(bookId: number, userHoldingBook: number | null): Book | undefined {
        return this.bookRepository.updateUserHoldingBook(bookId, userHoldingBook);
    }
}
    