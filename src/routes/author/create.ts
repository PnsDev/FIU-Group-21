import { randomUUID } from "crypto";
import { Request, Response } from "express";
import Author from "../../types/author";
import authChecker from "../../utils/authChecker";
import response from "../../utils/response";

async function reqHandler(req: Request, res: Response) : Promise<any> {
        
    // TODO: some sort of AUTH header check here
    if (req.headers.authorization === undefined || !authChecker(req.headers.authorization)) 
        return res.status(401).send(response(false, 'Invalid authorization header'));

    let tempAuthor = req.body;

    // Generate a random ID for the author (or overwrite the one provided)
    tempAuthor.id = randomUUID();

    //TODO: check for identical authors (same name, same publisher, same biography)

    // Make a valid book object
    const author : Author | null = Author.fromJSON(tempAuthor);

    if (author === null)
        return res.status(400).send(response(false, 'Invalid book provided'));
    
    //TODO: check for identical authors (same name, same publisher, same biography)

    // Save the book
    if (await author.save()) return res.status(200).send(JSON.stringify(
        {
            successful: true,
            message: 'Author has been saved',
            authorId: author.id,
        }
    ));
    return res.status(500).send(response(false, 'Internal server error'));
};