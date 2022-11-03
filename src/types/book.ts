import books from "../mongoDB/schemas/books";
import {validateObjectValues} from "../utils/classUtils";

export default class Book {
    ISBN: string;
    name: string;
    description: string;
    price: number;
    author: string;
    genre: string[];
    datePublished: Date;
    [key: string]: any; // Used for easy updating


    static readonly fields: Map<string, string> = new Map([
        ['ISBN', 'string'],
        ['name', 'string'],
        ['description', 'string'],
        ['price', 'number'],
        ['author', 'string'],
        ['genre', 'object'],
        ['datePublished', 'date']
    ]);

    /**
     * Creates a book object
     * @param ISBN The ISBN of the book
     * @param name The name of the book
     * @param description The description of the book
     * @param price The price of the book
     * @param author The author of the book
     * @param genre The genres of the book
     * @param datePublished The date the book was published
     */
    private constructor(ISBN: string, name: string, description: string, price: number, author: string, genre: string[], datePublished: Date) {
        this.ISBN = ISBN;
        this.name = name;
        this.description = description;
        this.price = price;
        this.author = author;
        this.genre = genre;
        this.datePublished = datePublished;
    }

    /**
     * Creates a book from a valid JSON object
     * @param JSONAuthor The JSON object to convert to a Book object
     * @returns The Book object if the JSON object is valid, null if not
     */
    public static fromJSON(JSONBook: any) : Book | null {
        if (!validateObjectValues(JSONBook, this.fields)) return null;
        if (!Array.isArray(JSONBook.genre)) return null;

        return new Book(JSONBook['ISBN'], JSONBook['name'], JSONBook['description'], JSONBook['price'], JSONBook['author'], JSONBook['genre'], new Date(JSONBook['datePublished']));
    }

    /**
     * Creates a book from a valid ID stored in the database
     * @param ISBN The ISBN of the book
     * @returns The book if it exists in the database, null if not
     */
     public static async fromISBN(ISBN: string) : Promise<Book | null> { //TODO: maybe clean this up
        let temp = await (new Book(ISBN, "", "", 0, "", [], new Date())).findInDB();
        return (temp === null ? null : new Book(temp.ISBN, temp.name, temp.description, temp.price, temp.author, temp.genre, temp.datePublished));
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

        // Update the book schema with the new values
        book.ISBN = this.ISBN;
        book.name = this.name;
        book.description = this.description;
        book.price = this.price;
        book.author = this.author;
        book.genre = this.genre;
        book.datePublished = this.datePublished;

        try { // Save the book
            await book.save(); 
        } catch (ex) { return false; }
        return true;
    }

    /**
     * Deletes the book from the database
     * @returns A boolean indicating if the author was deleted
     */
    public async delete() : Promise<boolean> {
        const book = await this.findInDB();
        if (book === null) return false;

        try {
            await book.delete();
        } catch (ex) { return false; }
        return true;
    }

    /**
     * Checks if the book is stored in the database
     * @returns true if the book is stored in the database, false if not
     */
     public async inDatabase() : Promise<boolean> {
        let book = await this.findInDB();
        return book !== null;
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