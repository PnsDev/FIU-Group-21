import { Request, Response } from "express";
import User from "../../types/user";
import response from "../../utils/response";

async function reqHandler(req: Request, res: Response) : Promise<any> {
    



    if (req.headers.authorization === undefined) 
        return res.status(401).send(response(false, 'Invalid authorization header'));


    const user = await User.fromToken(req.headers.authorization);
    if (user === null)
        return res.status(401).send(response(false, 'Invalid user'));

    // loop through all the lists (user.wishlists) getWishlist(list.name, true)
};

export default reqHandler;