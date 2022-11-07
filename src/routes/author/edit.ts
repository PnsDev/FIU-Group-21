import { Request, Response } from "express";
import Author from "../../types/author";
import authChecker from "../../utils/authChecker";
import { isEmpty } from "../../utils/classUtils";
import { apiResponse } from "../../utils/miscUtils";

export default async function(req: Request, res: Response): Promise<any> {
    if (!(await authChecker(req.headers.authorization)))
        return res.status(401).send(apiResponse(false, 'Invalid authorization header'));

    if (req.query.ID === undefined)
        return res.status(400).send(apiResponse(false, 'Author ID not provided'));

    delete req.body.id; // Don't allow the user to change the ID

    if (isEmpty(req.body))
        return res.status(400).send(apiResponse(false, 'No data provided'));
    
    const author = await Author.fromID(req.query.ID as string);
    if (author == null) 
        return res.status(404).send(apiResponse(false, 'No author found with that ID'));

    // Loop through the body and update the author
    for (const key in req.body) {
        if (Author.fields.get(key) === undefined) continue;
        author[key] = req.body[key];
    }

    if (await author.save()) return res.status(200).send(apiResponse(true, 'Author updated succesfully'));
    return res.status(500).send(apiResponse(false, 'Internal server error'));
};