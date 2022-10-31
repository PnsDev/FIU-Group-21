import { Request, Response } from "express";

async function reqHandler(req: Request, res: Response) : Promise<any> {
    res.send('rlist');
};

export default reqHandler;