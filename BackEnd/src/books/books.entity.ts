export class Book {
    bookId: number;
    title: string;
    author: string;
    borrowed: boolean = false;
    constructor(bookId: number, title: string, author: string) {
        this.bookId = bookId;
        this.title = title;
        this.author = author;
        this.borrowed = false;
    }

}