import { Request, Response } from "express";
import { getAllBooksByAuthor } from "../../utils/authorUtils";
import Author from "../../types/author";
import { apiResponse } from "../../utils/miscUtils";

export default async function(req: Request, res: Response) : Promise<any> {
    if (req.query.ID === undefined) return res.status(400).send(apiResponse(false, 'Author ID not provided'));
    
    const author = await Author.fromID(req.query.ID as string);
    if (author == null) return res.status(404).send(apiResponse(false, 'No author found with that ID'));

    return res.status(200).send(JSON.stringify({
        success: true,
        author: author,
        books: await getAllBooksByAuthor(author.id)
    }));
};