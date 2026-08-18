export class Book {
    bookId: number;
    title: string;
    author: string;
    userHoldingBook: number | null;
    borrowed: boolean = false;
    constructor(bookId: number, title: string, author: string, userHoldingBook: number | null) {
        this.bookId = bookId;
        this.title = title;
        this.author = author;
        this.userHoldingBook = userHoldingBook;
        this.borrowed = userHoldingBook !== null;
    }

}