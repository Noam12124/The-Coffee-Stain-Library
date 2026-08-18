import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

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

  async create(userData: any) { 
    return this.userRepository.create(userData);
  }
}