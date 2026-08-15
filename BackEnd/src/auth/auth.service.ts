import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { omit } from 'lodash';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

 async signup(createUserDto: any) {
    const existing = await this.usersService.findByEmail(createUserDto.email);
    if (existing) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);


    const newUser = {
      id: Date.now(),
      email: createUserDto.email,
      password: hashedPassword,
      books: [], 
    };

    
    const savedUser = await this.usersService.create(newUser);

    return this.login(savedUser);
  }
  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    const sanitizedUser = omit(user, ['password']);
    return {
      access_token: this.jwtService.sign(payload),
      user: sanitizedUser,
    };
  }
    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return user;
    }


}