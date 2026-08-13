import { Injectable } from '@nestjs/common';
import { MockDatabaseService } from '../mock-database.service'; 
import { Book } from './books.entity';

@Injectable()
export class BookRepository {
    constructor(private readonly mockDb: MockDatabaseService) {}

    findAll(): Book[] {
        return this.mockDb.books;
    }
    findById(id: number): Book | undefined {
        return this.mockDb.books.find((book: Book) => book.id === id);
    }

    updateUserHoldingBook(bookId: number, userHoldingBook: number | null): Book | undefined {
        const book = this.findById(bookId); 
        if (book) {
            book.userHoldingBook = userHoldingBook;
        }
        return book;
    }
}