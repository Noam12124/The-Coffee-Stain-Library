import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './users.repository';
import { Book } from 'src/books/books.entity';
import { BookRepository } from 'src/books/books.repository';
import { CreateUserDto } from './dto/create-user.dto';
@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository, private readonly bookRepository: BookRepository) {}

  findByEmail(email: string) {
    const user = this.userRepository.findByEmail(email);
    return user;
  }
  findById(id: number) {
    const user = this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
  
  borrowBook(bookId: number, userId: number): Book {
        const book = this.bookRepository.findById(bookId);
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

        this.userRepository.addBookToUser(userId, bookId); 
        
        return book;
    }

    returnBook(bookId: number, userId: number): Book {
        const book = this.bookRepository.findById(bookId);
        const user = this.userRepository.findById(userId);

        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }

        const hasBook = user.books.some((b: number) => b === bookId);
        if (!hasBook) {
            throw new BadRequestException('This user did not borrow this book');
        }

        this.userRepository.removeBookFromUser(userId, bookId); 

        return book;
    }

  async create(userData: CreateUserDto) { 
    return this.userRepository.create(userData);
  }
}