import { Request, Response } from "express";
import authChecker from "../../utils/authChecker";
import response from "../../utils/response";

import Book from "../../types/book";
import Comment from "../../types/comment";

export default async function(req: Request, res: Response) : Promise<any> {
    
    if (req.headers.authorization === undefined || !authChecker(req.headers.authorization)) 
        return res.status(401).send(response(false, 'Invalid authorization header'));
    
    // Make a valid comment object
    const comment : Comment | null = Comment.fromJSON(req.body);
    if (comment === null)
        return res.status(400).send(response(false, 'Invalid comment provided'));

    if (await Book.getBookByISBN(comment.ISBN) === null)
        return res.status(404).send(response(false, 'Book could not be found'));

    // Save the comment
    if (await comment.save()) return res.status(200).send(response(true, 'Comment saved'));
    return res.status(500).send(response(false, 'Internal server error'));
};
