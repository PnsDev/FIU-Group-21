import { Request, Response } from "express";
import authChecker from "../../utils/authChecker";

import Book from "../../types/book";
import Comment from "../../types/comment";
import { apiResponse } from "../../utils/miscUtils";

export default async function(req: Request, res: Response) : Promise<any> {
    
    if (req.headers.authorization === undefined || !authChecker(req.headers.authorization)) 
        return res.status(401).send(apiResponse(false, 'Invalid authorization header'));
    
    // Make a valid comment object
    const comment : Comment | null = Comment.fromJSON(req.body);
    if (comment === null)
        return res.status(400).send(apiResponse(false, 'Invalid comment provided'));

    if (await Book.fromISBN(comment.ISBN) === null)
        return res.status(404).send(apiResponse(false, 'Book could not be found'));

    // Save the comment
    if (await comment.save()) return res.status(200).send(apiResponse(true, 'Comment saved'));
    return res.status(500).send(apiResponse(false, 'Internal server error'));
};
