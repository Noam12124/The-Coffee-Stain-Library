import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: '9f2c8d4e7b1a6f3c5e8d2a4b7f1c9e3a6d2f5b8c1e4a7d9f3b6c2e5a8d1f4c7b', 
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}