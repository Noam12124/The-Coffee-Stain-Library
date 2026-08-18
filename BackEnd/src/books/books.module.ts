// books.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { BooksController } from './books.controller';
import { UsersModule } from '../users/users.module';
import { BookRepository } from './books.repository';
import { BookService } from './books.service';

@Module({
    imports: [forwardRef(() => UsersModule)],
    controllers: [BooksController],
    providers: [BookService, BookRepository],
    exports: [BookRepository],
})
export class BooksModule {}