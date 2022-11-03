import books from "../mongoDB/schemas/books";
import Book from "../types/book";

/**
 * Gets all books by an author from the database
 * @param id The ID of the author
 * @returns An array of books by the author
 */
export async function getAllBooksByAuthor(id: String): Promise<Book[]> {
    return new Promise((resolve) => {
        books.find({author: id}, (err: any, dbBooks: any) => {
            if (err) return resolve([]);

            let listOfBooks : Book[] = [];
            for (let i = 0; i < dbBooks.length; i++) {
                const book = Book.fromJSON({
                    ISBN: dbBooks[i].ISBN,
                    name: dbBooks[i].name,
                    description: dbBooks[i].description,
                    price: dbBooks[i].price,
                    author: dbBooks[i].author,
                    genre: dbBooks[i].genre,
                    datePublished: dbBooks[i].datePublished.getTime()
                });
                if (book !== null) listOfBooks.push(book);
            }
            resolve(listOfBooks);
        });
    });
}