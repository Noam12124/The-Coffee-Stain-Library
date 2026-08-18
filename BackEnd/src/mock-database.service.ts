import { Injectable, OnModuleInit } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Book } from './books/books.entity';
import { User, UserRole } from './users/users.entity';

@Injectable()
export class MockDatabaseService implements OnModuleInit {
    users: User[] = [];
    books: Book[] = [];

    async onModuleInit() {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        const admin = new User(1, 'Admin', 'admin@library.com', UserRole.ADMIN, hashedPassword);
        this.users.push(admin);
    }
}