import { Request, Response } from "express";
import response from "../../utils/response";

import Book from "../../types/book";

export default async function(req: Request, res: Response) : Promise<any> {

    if (req.query.ISBN === undefined) return res.status(400).send(response(false, 'ISBN not provided'));
    const ISBN = req.query.ISBN as string;

    // Make a valid book object
    const book = await Book.fromISBN(ISBN);
    if (book === null)
        return res.status(400).send(response(false, 'No match found for ISBN'));

    const result = {success: true, book: book};

    return res.status(200).send(JSON.stringify(result));
};