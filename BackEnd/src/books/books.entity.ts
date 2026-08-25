export class Book {
    bookId: number;
    title: string;
    author: string;
    userHoldingBook: number | null;
    borrowed: boolean = false;
    imageUrl: string;

    constructor(
        bookId: number,
        title: string,
        author: string,
        userHoldingBook: number | null,
        imageUrl: string = '',
    ) {
        this.bookId = bookId;
        this.title = title;
        this.author = author;
        this.userHoldingBook = userHoldingBook;
        this.borrowed = userHoldingBook !== null;
        this.imageUrl = imageUrl;
    }
}
