export class Book {
    id: number;
    title: string;
    author: string;
    userHoldingBook: number | null;
    constructor(id: number, title: string, author: string, userHoldingBook: number | null) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.userHoldingBook = userHoldingBook;
    }

}