import { Request, Response } from "express";

async function reqHandler(req: Request, res: Response) : Promise<any> {
    res.send('Hello World!');
};

export default reqHandler;