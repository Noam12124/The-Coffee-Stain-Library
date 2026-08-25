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
        return this.mockDb.books.find((book: Book) => book.bookId === id);
    }

    updateUserHoldingBook(bookId: number, userHoldingBook: number | null): Book | undefined {
        const book = this.findById(bookId);
        if (book) {
            book.userHoldingBook = userHoldingBook;
            book.borrowed = userHoldingBook !== null;
        }
        return book;
    }

    findAvailable(): Book[] {
        return this.mockDb.books.filter((b: Book) => !b.borrowed);
    }

    findBorrowed(): Book[] {
        return this.mockDb.books.filter((b: Book) => b.borrowed);
    }

    createBook(title: string, author: string, imageUrl: string = ''): Book {
        let maxId = 0;
        for (const book of this.mockDb.books) {
            if (book.bookId > maxId) maxId = book.bookId;
        }
        const book = new Book(maxId + 1, title, author, null, imageUrl);
        this.mockDb.books.push(book);
        return book;
    }

    updateBook(
        bookId: number,
        data: { title?: string; author?: string; imageUrl?: string },
    ): Book | undefined {
        const book = this.findById(bookId);
        if (!book) return undefined;
        if (data.title     !== undefined) book.title     = data.title;
        if (data.author    !== undefined) book.author    = data.author;
        if (data.imageUrl  !== undefined) book.imageUrl  = data.imageUrl;
        return book;
    }

    deleteBook(bookId: number): boolean {
        const idx = this.mockDb.books.findIndex((b: Book) => b.bookId === bookId);
        if (idx === -1) return false;
        this.mockDb.books.splice(idx, 1);
        return true;
    }
}
