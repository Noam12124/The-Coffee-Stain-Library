//import { Book } from './book.entity'; 
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}
export class User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  numOfBooks: number = 0;
  //books: Book[] = [];
    constructor(id: number, name: string, email: string, role: UserRole) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = role;
  }
}
