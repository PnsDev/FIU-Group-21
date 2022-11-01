import { Request, Response } from "express";
import authChecker from "../../utils/authChecker";
import response from "../../utils/response";

import Book from "../../types/book";
import Rating from "../../types/rating";

export default async function(req: Request, res: Response) : Promise<any> {
    
    if (req.headers.authorization === undefined || !authChecker(req.headers.authorization)) 
        return res.status(401).send(response(false, 'Invalid authorization header'));
    
    // Make a valid rating object
    const rating : Rating | null = Rating.fromJSON(req.body);
    if (rating === null)
        return res.status(400).send(response(false, 'Invalid rating provided'));

    if (await Book.getBookByISBN(rating.ISBN) === null)
        return res.status(404).send(response(false, 'Book could not be found'));

    if (await Rating.getRatingByUser(rating.userName))
        return res.status(400).send(response(false, 'Rating already exists, try updating it instead'));

    // Save the rating
    if (await rating.save()) return res.status(200).send(response(true, 'Rating saved'));
    return res.status(500).send(response(false, 'Internal server error'));
};
