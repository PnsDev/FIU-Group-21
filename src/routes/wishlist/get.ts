import { Request, Response } from "express";
import response from "../../utils/response";
import User from "../../types/user";
import Book from "../../types/book";
import { userInfo } from "os";
import books from "../../mongoDB/schemas/books";

export default async function(req: Request, res: Response) : Promise<any> {
    // localhost:3000/wishlist/get?list=name
    if (req.query.ISBN === undefined) return res.status(400).send(response(false, 'Wishlist not provided'));
    const name = req.query.name as string;

    const wishlist = await Book.getWishlist(name);
    if (wishlist === null)
        return res.status(400).send(response(false, 'No match found for ISBN'));

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