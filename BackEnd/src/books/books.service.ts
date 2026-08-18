import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Book } from './books.entity';
import { BookRepository } from './books.repository';
import { UserRepository } from '../users/users.repository';

@Injectable()
export class BookService {
    constructor(
        private readonly bookRepository: BookRepository,
        private readonly userRepository: UserRepository,
    ) {}

    findAll(): Book[] {
        return this.bookRepository.findAll();
    }

    findById(id: number): Book {
        const book = this.bookRepository.findById(id);
        if (!book) {
            throw new NotFoundException(`Book with ID ${id} not found`);
        }
        return book;
    }

    findAvailable(): Book[] {
        return this.bookRepository.findAvailable();
    }

    findBorrowed(): Book[] {
        return this.bookRepository.findBorrowed();
    }

    create(bookData: { title: string; author: string }): Book {
        return this.bookRepository.createBook(bookData.title, bookData.author);
    }

    update(id: number, bookData: { title?: string; author?: string }): Book {
        const updated = this.bookRepository.updateBook(id, bookData);
        if (!updated) {
            throw new NotFoundException(`Book with ID ${id} not found`);
        }
        return updated;
    }

delete(id: number): { deleted: boolean } {
        const book = this.findById(id);
        
        if (book.borrowed) {
            throw new BadRequestException('Cannot delete a book that is currently borrowed');
        }

        const ok = this.bookRepository.deleteBook(id);
        if (!ok) {
            throw new NotFoundException(`Book with ID ${id} not found`);
        }
        return { deleted: ok };
    }

    borrowBook(bookId: number, userId: number): Book {
        const book = this.findById(bookId);
        if (book.borrowed) {
            throw new BadRequestException('Book is already borrowed');
        }

        const user = this.userRepository.findById(userId);
        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }

        if (user.books.length >= 3) {
            throw new BadRequestException('User has reached the limit of 3 borrowed books');
        }

        this.bookRepository.updateUserHoldingBook(bookId, userId);
        this.userRepository.addBookToUser(userId, book); 
        
        return book;
    }

    returnBook(bookId: number, userId: number): Book {
        const book = this.findById(bookId);
        const user = this.userRepository.findById(userId);

        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }

        const hasBook = user.books.some((b: Book) => b.bookId === bookId);
        if (!hasBook) {
            throw new BadRequestException('This user did not borrow this book');
        }

        this.bookRepository.updateUserHoldingBook(bookId, null);
        this.userRepository.removeBookFromUser(userId, book); 
        
        return book;
    }
}