import { Request, Response } from "express";
import Book from "../../types/book";
import User from "../../types/user";
import response from "../../utils/response";

export default async function(req: Request, res: Response) : Promise<any> {


    // localhost:3000/wishlist/add <--- no work
    // localhost:3000/wishlist/add    ?ISBN=1234 ?list=name
    


    // header: authorization
    // 

    if (req.headers.authorization === undefined) 
        return res.status(401).send(response(false, 'Invalid authorization header'));

    if (req.query.ISBN === undefined)
        return res.status(400).send(response(false, 'ISBN not provided'));
    
    if (req.query.list === undefined)
        return res.status(400).send(response(false, 'List not provided'));

    const user = await User.fromToken(req.headers.authorization);
    if (user === null)
        return res.status(401).send(response(false, 'Invalid user'));

    if (!(await user.getWishlist(req.query.list as string, false)))
        return res.status(400).send(response(false, 'Invalid wishlist'));

    const book = await Book.getBookByISBN(req.query.ISBN as string);
    if (book === null)
        return res.status(400).send(response(false, 'No match found for ISBN'));

    // Add the book to the wishlist
    if (await user.addBookToList(book, req.query.list as string)) return res.status(200).send(response(true, 'Book added to wishlist'));
    else return res.status(500).send(response(false, 'Internal server error'));
};