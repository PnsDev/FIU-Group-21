import { Request, Response } from "express";
import response from "../../utils/response";
import getAllBooksByAuthorID from "../../utils/authorUtils";
import Author from "../../types/author";
import Book from "../../types/book";

async function reqHandler(req: Request, res: Response) : Promise<any> {
    if (req.query.ID === undefined) return res.status(400).send(response(false, 'Author ID not provided'));
    
    const author = await Author.fromID(req.query.ID as string);
    if (author == null) return res.status(404).send(response(false, 'No author found with that ID'));

    return res.status(200).send(JSON.stringify({
        success: true,
        author: author,
        books: (await getAllBooksByAuthorID(author.id)).map((book: any) => Book.fromJSON({
            ISBN: book.ISBN,
            name: book.name,
            description: book.description,
            price: book.price,
            author: book.author,
            genre: book.genre
        }))
    }));
};

export default reqHandler;