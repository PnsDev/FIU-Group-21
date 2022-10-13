import { Request, Response } from "express";
import authChecker from "../../utils/authChecker";
import response from "../../utils/response";

async function reqHandler(req: Request, res: Response) : Promise<any> {
        
    // TODO: some sort of AUTH header check here
    if (req.headers.authorization === undefined || !authChecker(req.headers.authorization)) 
        return res.status(401).send(response(false, 'Invalid authorization header'));
    // allows for the editing of an author
};