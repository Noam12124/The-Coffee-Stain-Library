import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { UserRepository } from './users.repository';
import { BookRepository } from '../books/book.repository'; 

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly bookRepository: BookRepository,
  ) {}

  findAll() {
    return this.userRepository.findAll();
  }

  findOne(id: string) {
    const user = this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  borrowBook(userId: string, bookId: string) {
    const user = this.findOne(userId);
    const book = this.bookRepository.findById(bookId);

    if (!book) {
      throw new NotFoundException(`Book with ID ${bookId} not found`);
    }

    if (book.isRented) {
      throw new BadRequestException('This book is already rented by another user');
    }

    if (user.borrowedBooks.length >= 3) {
      throw new BadRequestException('User has reached the maximum limit of 3 borrowed books');
    }

    this.bookRepository.updateStatus(bookId, true, userId);
    return this.userRepository.addBookToUser(userId, bookId);
  }

  returnBook(userId: string, bookId: string) {
    const user = this.findOne(userId);
    
    if (!user.borrowedBooks.includes(bookId)) {
      throw new BadRequestException('This user did not borrow this book');
    }

    this.bookRepository.updateStatus(bookId, false, null);
    return this.userRepository.removeBookFromUser(userId, bookId);
  }
}