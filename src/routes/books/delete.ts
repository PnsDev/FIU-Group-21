import { Request, Response } from "express";
import authChecker from "../../utils/authChecker";
import response from "../../utils/response";

import Book from "../../types/book";

export default async function(req: Request, res: Response) : Promise<any> {

    if (req.headers.authorization === undefined || !authChecker(req.headers.authorization)) 
        return res.status(401).send(response(false, 'Invalid authorization header'));

    if (req.query.ISBN === undefined) 
        return res.status(400).send(response(false, 'ISBN not provided'));

    const book = await Book.getBookByISBN(req.query.ISBN as string);
    if (book === null)
        return res.status(400).send(response(false, 'No match found for ISBN'));

    // Delete the book
    if (await book.delete()) return res.status(200).send(response(true, 'Book deleted'));
    return res.status(500).send(response(false, 'Internal server error'));
};