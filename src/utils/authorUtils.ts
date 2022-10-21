import books from "../mongoDB/schemas/books";

async function getAllBooksByAuthorID(id: String): Promise<any> {
    return new Promise((resolve) => {
        books.find({author: id}, (err: any, books: any) => {
            if (err) resolve([]);
            return resolve(books);
        });
    });
}


export default getAllBooksByAuthorID;