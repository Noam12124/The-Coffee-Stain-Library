import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MockDatabaseModule } from './mock-database.module';
import { AuthModule } from './auth/auth.module';
import { BooksModule } from './books/books.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware'; // Adjust path if needed

@Module({
  imports: [MockDatabaseModule, UsersModule, AuthModule, BooksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*'); 
  }
}