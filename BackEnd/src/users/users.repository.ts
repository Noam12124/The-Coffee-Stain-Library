import { Injectable } from '@nestjs/common';
import { MockDatabaseService } from '../mock-database.service'; 
import { User } from './entities/user.entity/user.entity';
 
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
    addBookToUser(userId: string | number, bookId: string | number): User | undefined {
        const user = this.findById(userId);
        if (user) {
            //TODO : Implement logic to add the bookId to the user's borrowedBooks array and increment numOfBooks
        }
        return user;
    }
    removeBookFromUser(userId: string | number, bookId: string | number): User | undefined {
        const user = this.findById(userId);
        if (user) {
            //TODO : Implement logic to remove the bookId from the user's borrowedBooks array and decrement numOfBooks
        }
        return user;
    }
}