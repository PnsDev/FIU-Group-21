import { Request, Response } from "express";
import authChecker from "../../utils/authChecker";
import response from "../../utils/response";
import Author from "../../types/author";
import getAllBooksByAuthorID from "../../utils/authorUtils";

export default async function reqHandler(req: Request, res: Response) : Promise<any> {
    if (req.headers.authorization === undefined || !authChecker(req.headers.authorization)) 
        return res.status(401).send(response(false, 'Invalid authorization header'));

    if (req.query.ID === undefined)
        return res.status(400).send(response(false, 'Author ID not provided'));

    const author = await Author.fromID(req.query.ID as string);
    if (author == null) return res.status(404).send(response(false, 'No author found with that ID'));

    (await getAllBooksByAuthorID(author.id)).forEach((book: any) => book.delete());

    // Delete the author
    if (await author.delete()) return res.status(200).send(response(true, 'Author deleted'));
    return res.status(500).send(response(false, 'Internal server error'));

};