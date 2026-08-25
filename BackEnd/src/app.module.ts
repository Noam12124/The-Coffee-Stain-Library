import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; 
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MockDatabaseModule } from './mock-database.module';
import { AuthModule } from './auth/auth.module';
import { BooksModule } from './books/books.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), 
    MockDatabaseModule, 
    UsersModule, 
    AuthModule, 
    BooksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}