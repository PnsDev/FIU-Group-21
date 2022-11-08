import { Request, Response } from "express";
import User from "../../types/user";
import { apiResponse } from "../../utils/miscUtils";

async function reqHandler(req: Request, res: Response) : Promise<any> {
    



    if (req.headers.authorization === undefined) 
        return res.status(401).send(apiResponse(false, 'Invalid authorization header'));

    if (req.query.list === undefined)
        return res.status(400).send(apiResponse(false, 'List not provided'));

    const user = await User.fromToken(req.headers.authorization);
    if (user === null)
        return res.status(401).send(apiResponse(false, 'Invalid user'));

    if (!(await user.getWishlist(req.query.list as string, false)))
        return res.status(400).send(apiResponse(false, 'Invalid wishlist'));
};

export default reqHandler;