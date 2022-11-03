import { randomUUID } from "crypto";
import { Request, Response } from "express";
import Author from "../../types/author";
import authChecker from "../../utils/authChecker";
import { isEmpty } from "../../utils/classUtils";
import { apiResponse } from "../../utils/miscUtils";

export default async function(req: Request, res: Response) : Promise<any> {
        
    if (req.headers.authorization === undefined || !authChecker(req.headers.authorization)) 
        return res.status(401).send(apiResponse(false, 'Invalid authorization header'));

    if (isEmpty(req.body))
        return res.status(400).send(apiResponse(false, 'No data provided'));

    // Generate a random ID for the author (or overwrite the one provided)
    req.body.id = randomUUID();

    // Make a valid author object
    const author : Author | null = Author.fromJSON(req.body);

    if (author === null) // Valid author body
        return res.status(400).send(apiResponse(false, 'Invalid author provided'));

    if (await author.isAuthorAlreadyInDB()) // Make sure there are no dupes
        return res.status(400).send(apiResponse(false, 'Author has already been saved'));

    // Save the author
    if (await author.save()) return res.status(200).send(JSON.stringify(
        {
            successful: true,
            message: 'Author has been saved',
            authorId: author.id,
        }
    ));
    return res.status(500).send(apiResponse(false, 'Internal server error'));
};