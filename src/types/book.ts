import books from "../mongoDB/schemas/books";

export default class Book {
    ISBN: string;
    name: string;
    description: string;
    price: number;
    author: string;
    genre: string[];
    publisher: string;

    private constructor(ISBN: string, name: string, description: string, price: number, author: string, genre: string[], publisher: string) {
        this.ISBN = ISBN;
        this.name = name;
        this.description = description;
        this.price = price;
        this.author = author;
        this.genre = genre;
        this.publisher = publisher;
    }

    /**
     * Create book with a valid provided Object
     */
    public static fromJSON(JSONBook: any) : Book | null {
        // TODO: kinda messy, maybe make a better way to do this
        if (!JSONBook.hasOwnProperty('ISBN') || typeof JSONBook['ISBN'] !== 'string') return null;
        if (!JSONBook.hasOwnProperty('name') || typeof JSONBook['name'] !== 'string') return null;
        if (!JSONBook.hasOwnProperty('description') || typeof JSONBook['description'] !== 'string') return null;
        if (!JSONBook.hasOwnProperty('price') || typeof JSONBook['price'] !== 'number') return null;
        if (!JSONBook.hasOwnProperty('author') || typeof JSONBook['author'] !== 'string') return null;
        if (!JSONBook.hasOwnProperty('genre') || typeof JSONBook['genre'] !== 'object') return null;
        if (!JSONBook.hasOwnProperty('publisher') || typeof JSONBook['publisher'] !== 'string') return null;

        return new Book(JSONBook['ISBN'], JSONBook['name'], JSONBook['description'], JSONBook['price'], JSONBook['author'], JSONBook['genre'], JSONBook['publisher']);
    }


    /**
     * Gets a book from the database by ISBN
     */
     public static async getBookByISBN(ISBN: string) : Promise<Book | null> { //TODO: maybe clean this up
        const book : Book = new Book(ISBN, "", "", 0, "", [], "");
        const bookInDB = await book.findInDB();

        if (bookInDB === null) return null;
        return new Book(bookInDB.ISBN, bookInDB.name, bookInDB.description, bookInDB.price, bookInDB.author, bookInDB.genre, bookInDB.publisher);
    }


    /**
     * Checks if the book exists in the database
     */
    public async inDatabase() : Promise<boolean> {
        let book = await this.findInDB();
        return book !== null;
    }

    /**
     * Saves the book to the database
     * @returns true if successful, false if not
     * @throws Error if the book already exists in the database
     * @throws Error if the book is invalid
     */
    public async save() : Promise<boolean> { //TODO: add TS types
        let book = await this.findInDB();
        if (book === null) book = new books();

        // Update the book
        book.ISBN = this.ISBN;
        book.name = this.name;
        book.description = this.description;
        book.price = this.price;
        book.author = this.author;
        book.genre = this.genre;
        book.publisher = this.publisher; //TODO: validate author and plublisher

        // Save the book
        try {
            await book.save(); //todo error handling through callback
            return true;
        } catch (ex) {
            return false;
        }
    }


    /**
     * Finds the book in the database
     * @returns the book if it exists in the database, null if not
     */
    private async findInDB() : Promise<any> {
        return new Promise((resolve) => {
            books.findOne({ISBN: this.ISBN}, (err: any, book: any) => {
                if (err) resolve(null);
                return resolve(book);
            });
        });
    }
}