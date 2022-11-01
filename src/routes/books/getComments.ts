import { Request, Response } from "express";
import response from "../../utils/response";

import Book from "../../types/book";
import Comment from "../../types/comment";

export default async function(req: Request, res: Response) : Promise<any> {

    if (req.query.ISBN === undefined) return res.status(400).send(response(false, 'ISBN not provided'));
    const ISBN = req.query.ISBN as string;

    // Make a valid book object
    const book = await Book.getBookByISBN(ISBN);
    if (book === null)
        return res.status(400).send(response(false, 'No match found for ISBN'));
    
    const comments = await Comment.getCommentsbyISBN(ISBN);

    if(comments === null)
        return res.status(400).send(response(false, 'No comments found'));

    const result = {success: true, comments: comments};

    return res.status(200).send(JSON.stringify(result));
};
