import { Request, Response } from "express";
import Book from "../../types/book";
import authChecker from "../../utils/authChecker";
import { assureValidValues, isEmpty } from "../../utils/classUtils";
import { apiResponse } from "../../utils/miscUtils";

export default async function(req: Request, res: Response): Promise<any> {
    if (req.headers.authorization === undefined || !authChecker(req.headers.authorization))
        return res.status(401).send(apiResponse(false, 'Invalid authorization header'));

    if (req.query.ISBN === undefined)
        return res.status(400).send(apiResponse(false, 'Book ISBN not provided'));

    if (isEmpty(req.body))
        return res.status(400).send(apiResponse(false, 'No data provided'));

    if (!assureValidValues(req.body, Book.fields))
        return res.status(400).send(apiResponse(false, 'Invalid data provided'));
    
    const book = await Book.fromISBN(req.query.ISBN as string);
    if (book == null) 
        return res.status(404).send(apiResponse(false, 'No book found with that ISBN'));

    // Loop through the body and update the book
    for (const key in req.body) {
        let type = Book.fields.get(key);
        if (type === undefined) continue;

        // add the date type check here
        if (type === 'date') book[key] = new Date(req.body[key]);
        else book[key] = req.body[key];
    }
    
    if (await book.save()) return res.status(200).send(apiResponse(true, 'Book updated succesfully'));
    return res.status(500).send(apiResponse(false, 'Internal server error'));
};