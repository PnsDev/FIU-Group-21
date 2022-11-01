import { Request, Response } from "express";
import response from "../../utils/response";

import Book from "../../types/book";
import Rating from "../../types/rating";

export default async function(req: Request, res: Response) : Promise<any> {

    // Make a valid rating object
    const rating = await Rating.getSorted();
    if (rating === null)
        return res.status(400).send(response(false, 'No match found for ISBN'));
    
    const result = {success: true, rating: rating};

    return res.status(200).send(JSON.stringify(result));
};
