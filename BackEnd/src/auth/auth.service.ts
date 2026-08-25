import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { omit } from 'lodash';
import { SignupDto } from './dto/signup.dto';
import { UserRepository } from '../users/users.repository';
import { UserRole } from '../users/users.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
  ) {}

  async signup(signupDto: SignupDto) {
    const existingUser = this.userRepository.findByEmail(signupDto.email);
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(signupDto.password, 10);
    
    const newUser = this.userRepository.create({
      name: signupDto.name,
      email: signupDto.email,
      password: hashedPassword,
      role: UserRole.USER,
    });

    return this.login(newUser);
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.userId, role: user.role };
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

    const isPlaintextMatch = user.password === password;
    const isBcryptMatch = await bcrypt.compare(password, user.password).catch(() => false);

    if (!isPlaintextMatch && !isBcryptMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
}