import { Request, Response } from "express";
import Book from "../../types/book";
import User from "../../types/user";
import { apiResponse } from "../../utils/miscUtils";

export default async function(req: Request, res: Response) : Promise<any> {


    // localhost:3000/wishlist/add <--- no work
    // localhost:3000/wishlist/add    ?ISBN=1234 ?list=name
    


    // header: authorization
    // 

    if (req.headers.authorization === undefined) 
        return res.status(401).send(apiResponse(false, 'Invalid authorization header'));

    if (req.query.ISBN === undefined)
        return res.status(400).send(apiResponse(false, 'ISBN not provided'));
    
    if (req.query.list === undefined)
        return res.status(400).send(apiResponse(false, 'List not provided'));

    const user = await User.fromToken(req.headers.authorization);
    if (user === null)
        return res.status(401).send(apiResponse(false, 'Invalid user'));

    if (!(await user.getWishlist(req.query.list as string, false)))
        return res.status(400).send(apiResponse(false, 'Invalid wishlist'));

    const book = await Book.fromISBN(req.query.ISBN as string);
    if (book === null)
        return res.status(400).send(apiResponse(false, 'No match found for ISBN'));

    // Add the book to the wishlist
    if (await user.addBookToList(book, req.query.list as string)) return res.status(200).send(apiResponse(true, 'Book added to wishlist'));
    else return res.status(500).send(apiResponse(false, 'Internal server error'));
};