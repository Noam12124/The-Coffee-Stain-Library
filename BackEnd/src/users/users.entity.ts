import { UserRole } from "../common/enums/user-role.enum";
export class User {
  userId: number;
  name: string;
  email: string;
  role: UserRole;
  numOfBooks: number = 0;
  books: number[] = [];
  password: string;
    constructor(userId: number, name: string, email: string, role: UserRole, password: string) {
    this.userId = userId;
    this.name = name;
    this.email = email;
    this.role = role;
    this.password = password;
    
  }
}
