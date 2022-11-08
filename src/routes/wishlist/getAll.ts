import { Request, Response } from "express";
import User from "../../types/user";
import { apiResponse } from "../../utils/miscUtils";


async function reqHandler(req: Request, res: Response) : Promise<any> {
    



    if (req.headers.authorization === undefined) 
        return res.status(401).send(apiResponse(false, 'Invalid authorization header'));


    const user = await User.fromToken(req.headers.authorization);
    if (user === null)
        return res.status(401).send(apiResponse(false, 'Invalid user'));

    // loop through all the lists (user.wishlists) getWishlist(list.name, true)
};

export default reqHandler;