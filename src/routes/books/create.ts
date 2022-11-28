import { Request, Response } from "express";
import authChecker from "../../utils/authChecker";

import Book from "../../types/book";
import Author from "../../types/author";
import { isEmpty } from "../../utils/classUtils";
import { apiResponse } from "../../utils/miscUtils";

export default async function(req: Request, res: Response) : Promise<any> {
    
    if (!(await authChecker(req.headers.authorization)))
        return res.status(401).send(apiResponse(false, 'Invalid authorization header'));

    if (isEmpty(req.body))
        return res.status(400).send(apiResponse(false, 'No data provided'));
    
    // Make a valid book object
    const book : Book | null = Book.fromJSON(req.body);
    if (book === null)
        return res.status(400).send(apiResponse(false, 'Invalid book provided'));

    if (await Author.fromID(book.author) === null)
        return res.status(404).send(apiResponse(false, 'Book author could not be found'));

    if (await book.inDatabase())
        return res.status(400).send(apiResponse(false, 'Book already exists, try updating it instead'));

    // Save the book
    if (await book.save()) return res.status(200).send(apiResponse(true, 'Book saved'));
    return res.status(500).send(apiResponse(false, 'Internal server error'));
};