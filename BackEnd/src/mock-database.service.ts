import { Injectable } from '@nestjs/common';
import { Book } from './books/books.entity';
import { User, UserRole } from './users/users.entity';

// Cover images: open-license covers from Open Library / covers.openlibrary.org
const COVERS = {
    gatsby:    'https://covers.openlibrary.org/b/id/8432472-L.jpg',
    mockingbird: 'https://covers.openlibrary.org/b/id/8228691-L.jpg',
    orwell:    'https://covers.openlibrary.org/b/id/8575708-L.jpg',
    dune:      'https://covers.openlibrary.org/b/id/8267977-L.jpg',
    pride:     'https://covers.openlibrary.org/b/id/8739161-L.jpg',
    dostoevsky:'https://covers.openlibrary.org/b/id/8446803-L.jpg',
    calvino:   'https://covers.openlibrary.org/b/id/9255566-L.jpg',
    coelho:    'https://covers.openlibrary.org/b/id/8356781-L.jpg',
};

@Injectable()
export class MockDatabaseService {
    books: Book[] = [
        new Book(1, 'The Great Gatsby',          'F. Scott Fitzgerald', null,  COVERS.gatsby),
        new Book(2, 'To Kill a Mockingbird',      'Harper Lee',          null,  COVERS.mockingbird),
        new Book(3, 'Nineteen Eighty-Four',       'George Orwell',       null,  COVERS.orwell),
        new Book(4, 'Dune',                       'Frank Herbert',       null,  COVERS.dune),
        new Book(5, 'Pride and Prejudice',        'Jane Austen',         null,  COVERS.pride),
        new Book(6, 'The Brothers Karamazov',     'Fyodor Dostoevsky',   null,  COVERS.dostoevsky),
        new Book(7, 'If on a winter\'s night…',  'Italo Calvino',       null,  COVERS.calvino),
        new Book(8, 'The Alchemist',              'Paulo Coelho',        null,  COVERS.coelho),
    ];

    users: User[] = [
        new User(1, 'Admin User', 'admin@library.com', UserRole.ADMIN, 'password123'), 
    new User(2, 'Alice Reader', 'alice@library.com', UserRole.USER, 'password123'),
];
onModuleInit() {
        console.log('\n🚀 --- MOCK DATABASE LOADED --- 🚀');
        console.table(this.users);
        console.log('-----------------------------------\n');
    }
}
