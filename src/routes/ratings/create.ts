import { Request, Response } from "express";
import authChecker from "../../utils/authChecker";

import Book from "../../types/book";
import Rating from "../../types/rating";
import { apiResponse } from "../../utils/miscUtils";

export default async function(req: Request, res: Response) : Promise<any> {
    
    if (req.headers.authorization === undefined || !authChecker(req.headers.authorization)) 
        return res.status(401).send(apiResponse(false, 'Invalid authorization header'));
    
    // Make a valid rating object
    const rating : Rating | null = Rating.fromJSON(req.body);
    if (rating === null)
        return res.status(400).send(apiResponse(false, 'Invalid rating provided'));

    if (await Book.fromISBN(rating.ISBN) === null)
        return res.status(404).send(apiResponse(false, 'Book could not be found'));

    if (await Rating.getRatingByUser(rating.userName))
        return res.status(400).send(apiResponse(false, 'Rating already exists, try updating it instead'));

    // Save the rating
    if (await rating.save()) return res.status(200).send(apiResponse(true, 'Rating saved'));
    return res.status(500).send(apiResponse(false, 'Internal server error'));
};
