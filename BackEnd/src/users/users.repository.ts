import { Injectable } from '@nestjs/common';
import { MockDatabaseService } from '../mock-database.service'; 
import { User } from './users.entity';
import { Book } from 'src/books/books.entity';
 
@Injectable()
export class UserRepository {
    constructor(private readonly mockDb: MockDatabaseService) {}
    
    findAll(): User[] {
        return this.mockDb.users;
    }

    findById(id: string | number): User | undefined {
        const numericId = Number(id);
        return this.mockDb.users.find((user: User) => user.id === numericId);
    }
    findByEmail(email: string): User | undefined {
        return this.mockDb.users.find((user: User) => user.email === email);
    }
    addBookToUser(userId: string | number, bookId: string | number): User | undefined {
        const user = this.findById(userId);
        if (user) {
            user.books.push(bookId as unknown as Book); 
        }
        return user;
    }
    removeBookFromUser(userId: string | number, bookId: string | number): User | undefined {
        const user = this.findById(userId);
        if (user) {
            user.books = user.books.filter((book: Book) => book.id !== Number(bookId));
        }
        return user;
    }
    create(userData: any): User {
        const newUser = new User(
            this.mockDb.users.length + 1,
            userData.name,
            userData.email,
            userData.role,
            userData.password
        );
        const users = this.mockDb.users as User[];
        users.push(newUser);
        return newUser;
    }
}