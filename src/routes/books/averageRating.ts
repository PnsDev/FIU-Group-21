import { Request, Response } from "express";

import Book from "../../types/book";
import Rating from "../../types/rating";
import { apiResponse } from "../../utils/miscUtils";

export default async function(req: Request, res: Response) : Promise<any> {

    if (req.query.ISBN === undefined) return res.status(400).send(apiResponse(false, 'ISBN not provided'));
    const ISBN = req.query.ISBN as string;

    // Make a valid book object
    const book = await Book.fromISBN(ISBN);
    if (book === null)
        return res.status(400).send(apiResponse(false, 'No match found for ISBN'));
    
    const averageRating = await Rating.getAverage(ISBN);

    if (averageRating === null)
        return res.status(400).send(apiResponse(false, 'No rating found'));

    const result = {success: true, averageRating: averageRating!.rate, ISBN: averageRating!.ISBN};

    return res.status(200).send(JSON.stringify(result));
};
