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

}