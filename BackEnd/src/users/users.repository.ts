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
        return this.mockDb.users.find((user: User) => user.userId === numericId);
    }

    findByEmail(email: string): User | undefined {
        return this.mockDb.users.find((user: User) => user.email === email);
    }

    addBookToUser(userId: string | number, book: Book): User | undefined {
        const user = this.findById(userId);
        if (user) {
            user.books.push(book); 
        }
        return user;
    }

    removeBookFromUser(userId: string | number, book: Book): User | undefined {
        const user = this.findById(userId);
        if (user) {
            user.books = user.books.filter((b: Book) => b.bookId !== book.bookId); 
        }
        return user;
    }

    create(userData: any): User {
        let maxId = 0;
        for (const user of this.mockDb.users) {
            if (user.userId > maxId) {
                maxId = user.userId;
            }
        }
        const nextId = maxId + 1;

        const newUser = new User(
            nextId,
            userData.name,
            userData.email,
            userData.role,
            userData.password
        );
        
        this.mockDb.users.push(newUser);
        return newUser;
    }
}