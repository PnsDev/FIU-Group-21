import { randomUUID } from "crypto";
import { Request, Response } from "express";
import Author from "../../types/author";
import User from "../../types/user";
import authChecker from "../../utils/authChecker";
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


    let user = await User.fromUserAndPass(req.body.username, req.body.password);

    user.save();
    

    return res.status(500).send(response(false, 'Internal server error'));
};