import { Book } from '../books/books.entity'; 
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}
export class User {
  userId: number;
  name: string;
  email: string;
  role: UserRole;
  password: string;
  books: Book[] = [];
    constructor(userId: number, name: string, email: string, role: UserRole, password: string) {
    this.userId = userId;
    this.name = name;
    this.email = email;
    this.role = role;
    this.password = password;
  }
}
