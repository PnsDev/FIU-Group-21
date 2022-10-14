import { Request, Response } from "express";

async function reqHandler(req: Request, res: Response) : Promise<any> {
    res.send('list');
};

export default reqHandler;