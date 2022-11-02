import { Request, Response } from "express";
import User from "../../types/user";
import response from "../../utils/response";

export default async function(req: Request, res: Response) : Promise<any> {
    
    // get username and pass from the request body
    // find the user in the database based on the password and username
    // if the user is found then generate a token and send it back to the user
    /**
     * {
     *    successful: true,
     *    token: "token"
     * }
     */

    // Save the author

    if (req.body.username === undefined || req.body.password === undefined)
        return res.status(400).send(response(false, 'Invalid username or password'));



    let user = await User.fromUserAndPass(req.body.username, req.body.password);

    if (user === null) 
        return res.status(401).send(response(false, 'Invalid credentials'));

    let token = await user.generateNewToken();
    if (token === null)
        return res.status(500).send(response(false, 'Internal server error'));

    return res.status(200).send(JSON.stringify({
        successful: true,
        token: token
    }));

};