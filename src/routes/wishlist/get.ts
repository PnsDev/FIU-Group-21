import { Request, response, Response } from "express";
import User from "../../types/user";
import Book from "../../types/book";
import { userInfo } from "os";
import books from "../../mongoDB/schemas/books";
import { apiResponse } from "../../utils/miscUtils";

export default async function(req: Request, res: Response) : Promise<any> {
    // localhost:3000/wishlist/get?list=name
    if(req.headers.authorization === undefined)
        return res.status(401).send(apiResponse(false, 'Invalid authorization header'));
    if (req.query.list === undefined) return res.status(400).send(apiResponse(false, 'Wishlist not provided'));
    const user = await User.fromToken(req.headers.authorization);
    if(user === null)
        return res.status(401).send(apiResponse(false, 'Invalid user'));

    const wishlist = await user.getWishlist(req.query.list as string)
    if (wishlist === null)
        return res.status(400).send(apiResponse(false, 'No match found for list'));

    const result = {success: true, wishlist: [books]};

    return res.status(200).send(JSON.stringify(result));

    /**
     * 
     * {
     *    success: true,
     *   wishlist: [
     *      
     *   ]
     * }
     * 
     * 
     * 
     * 
     */
};