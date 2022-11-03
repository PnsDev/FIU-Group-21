import { Request, Response } from "express";
import authChecker from "../../utils/authChecker";

import Book from "../../types/book";
import { apiResponse } from "../../utils/miscUtils";

export default async function(req: Request, res: Response) : Promise<any> {

    if (req.headers.authorization === undefined || !authChecker(req.headers.authorization)) 
        return res.status(401).send(apiResponse(false, 'Invalid authorization header'));

    if (req.query.ISBN === undefined) 
        return res.status(400).send(apiResponse(false, 'ISBN not provided'));

    const book = await Book.fromISBN(req.query.ISBN as string);
    if (book === null)
        return res.status(400).send(apiResponse(false, 'No match found for ISBN'));

    // Delete the book
    if (await book.delete()) return res.status(200).send(apiResponse(true, 'Book deleted'));
    return res.status(500).send(apiResponse(false, 'Internal server error'));
};