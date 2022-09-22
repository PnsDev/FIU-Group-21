import { Request, Response } from "express";
import response from "../../utils/response";

import Book from "../../types/book";

async function reqHandler(req: Request, res: Response) : Promise<any> {

    if (req.query.ISBN === undefined) return res.status(400).send(response(false, 'ISBN not provided'));
    const ISBN = req.query.ISBN as string;

    // Make a valid book object
    const book = await Book.getBookByISBN(ISBN);
    if (book === null)
        return res.status(400).send(response(false, 'No match found for ISBN'));

    const result = {success: true, book: book};

    //TODO: get author info and inject into dummy object
    // result.book.author = await Author.getAuthorByID(result.book.author); or something like that

    return res.status(200).send(JSON.stringify(result));
};

export default reqHandler;