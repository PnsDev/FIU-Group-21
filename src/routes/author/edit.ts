import { Request, Response } from "express";
import Author from "../../types/author";
import authChecker from "../../utils/authChecker";
import { isEmpty } from "../../utils/classUtils";
import response from "../../utils/response";

export default async function(req: Request, res: Response): Promise<any> {
    if (req.headers.authorization === undefined || !authChecker(req.headers.authorization))
        return res.status(401).send(response(false, 'Invalid authorization header'));

    if (req.query.ID === undefined)
        return res.status(400).send(response(false, 'Author ID not provided'));

    delete req.body.id; // Don't allow the user to change the ID

    if (isEmpty(req.body))
        return res.status(400).send(response(false, 'No data provided'));
    
    const author = await Author.fromID(req.query.ID as string);
    if (author == null) 
        return res.status(404).send(response(false, 'No author found with that ID'));

    // Loop through the body and update the author
    for (const key in req.body) {
        if (Author.fields.get(key) === undefined) continue;
        Object.defineProperties(author, req.body[key]);
    }

    if (await author.save()) return res.status(200).send(response(true, 'Author updated succesfully'));
    return res.status(500).send(response(false, 'Internal server error'));
};