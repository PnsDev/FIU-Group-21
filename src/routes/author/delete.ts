import { Request, Response } from "express";
import authChecker from "../../utils/authChecker";
import Author from "../../types/author";
import { getAllBooksByAuthor } from "../../utils/authorUtils";
import { apiResponse } from "../../utils/miscUtils";

export default async function reqHandler(req: Request, res: Response) : Promise<any> {
    if (req.headers.authorization === undefined || !authChecker(req.headers.authorization)) 
        return res.status(401).send(apiResponse(false, 'Invalid authorization header'));

    if (req.query.ID === undefined)
        return res.status(400).send(apiResponse(false, 'Author ID not provided'));

    const author = await Author.fromID(req.query.ID as string);
    if (author == null) return res.status(404).send(apiResponse(false, 'No author found with that ID'));

    (await getAllBooksByAuthor(author.id)).forEach((book: any) => book.delete());

    // Delete the author
    if (await author.delete()) return res.status(200).send(apiResponse(true, 'Author deleted'));
    return res.status(500).send(apiResponse(false, 'Internal server error'));

};