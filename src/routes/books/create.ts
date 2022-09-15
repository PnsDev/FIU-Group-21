import { Request, Response } from "express";
import authChecker from "../../utils/authChecker";
import response from "../../utils/response";

import Book from "../../types/book";

async function reqHandler(req: Request, res: Response) : Promise<any> {
    
    // TODO: some sort of AUTH header check here
    if (req.headers.authorization === undefined || !authChecker(req.headers.authorization)) 
        return res.status(401).send(response(false, 'Invalid authorization header'));
    
    // Make a valid book object
    const book = Book.fromJSON(req.body);
    if (book === null)
        return res.status(400).send(response(false, 'Invalid book provided'));

    if (await book.inDatabase())
        return res.status(400).send(response(false, 'Book already exists. Try updating it instead.'));

    // TODO: Check valid author ID

    // Save the book
    if (await book.save()) return res.status(200).send(response(true, 'Book saved'));
    return res.status(500).send(response(false, 'Internal server error'));
};

export default reqHandler;