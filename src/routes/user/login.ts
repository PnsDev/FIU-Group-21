import { Request, Response } from "express";
import User from "../../types/user";
import { apiResponse } from "../../utils/miscUtils";

export default async function(req: Request, res: Response) : Promise<any> {
    if (req.body.username === undefined || req.body.password === undefined)
        return res.status(400).send(apiResponse(false, 'Invalid username or password'));

    let user = await User.fromUserAndPass(req.body.username, req.body.password);

    if (user === null) 
        return res.status(401).send(apiResponse(false, 'Invalid credentials'));

    let token = await user.generateNewToken();
    if (token === null)
        return res.status(500).send(apiResponse(false, 'Internal server error'));

    return res.status(200).send(JSON.stringify({
        successful: true,
        token: token
    }));

};