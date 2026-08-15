import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { UserRepository } from './users.repository';
import { BookRepository } from '../books/books.repository'; 

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
      private readonly bookRepository: BookRepository,
  ) {}

  findAll() {
    return this.userRepository.findAll();
  }

  findById(id: number) {
    const user = this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  findByEmail(email: string) {
    const user = this.userRepository.findByEmail(email);
    return user;
  }

  borrowBook(userId: number, bookId: number) {
    const user = this.findById(userId);
    const book = this.bookRepository.findById(bookId);

    if (!book) {
      throw new NotFoundException(`Book with ID ${bookId} not found`);
    }

    if (book.userHoldingBook !== null) {
      throw new BadRequestException('This book is already rented by another user');
    }

    if (user.books.length >= 3) {
      throw new BadRequestException('User has reached the maximum limit of 3 borrowed books');
    }

    this.bookRepository.updateUserHoldingBook(bookId, userId);
    return this.userRepository.addBookToUser(userId, bookId);
  }

  returnBook(userId: number, bookId: number) {
    const user = this.findById(userId);
    const book = this.bookRepository.findById(bookId);

    if (!book) {
      throw new NotFoundException(`Book with ID ${bookId} not found`);
    }

    if (!user.books.includes(book)) {
      throw new BadRequestException('This user did not borrow this book');
    }

    this.bookRepository.updateUserHoldingBook(bookId, null);
    return this.userRepository.removeBookFromUser(userId, bookId);
  }
  async create(userData: any) {
    return this.userRepository.create(userData);
  }
}