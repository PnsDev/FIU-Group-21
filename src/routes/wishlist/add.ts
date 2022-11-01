import { Request, Response } from "express";

export default async function(req: Request, res: Response) : Promise<any> {
    return res.status(200).send('hello world');
};