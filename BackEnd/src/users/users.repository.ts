import { Injectable, NotFoundException } from '@nestjs/common';
import { MockDatabaseService } from '../mock-database.service'; 
import { User } from './users.entity';
import { Book } from 'src/books/books.entity';
 
@Injectable()
export class UserRepository {
    constructor(private readonly mockDb: MockDatabaseService) {}

    findById(id:number): User | undefined {
        const numericId = Number(id);
        return this.mockDb.users.find((user: User) => user.userId === numericId);
    }

    findByEmail(email: string): User {
        const user = this.mockDb.users.find((u: User) => u.email === email);
        
        if (!user) {
            throw new NotFoundException(`User with email ${email} not found`);
        }
        
        return user;
    }


    addBookToUser(userId:number, bookId: number): User | undefined {
        const user = this.findById(userId);
        const book = this.mockDb.books.find((b: Book) => b.bookId === bookId);
        if (!book) {
            throw new Error(`Book with ID ${bookId} not found`);
        }
        if (user) {
            user.books.push(bookId); 
        }
        return user;
    }

    removeBookFromUser(userId: number, bookId: number): User | undefined {
        const user = this.findById(userId);
        
        if (user) {
            user.books = user.books.filter((b: number) => b !== bookId); 
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