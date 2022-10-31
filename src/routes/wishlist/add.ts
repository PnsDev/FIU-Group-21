//creating logic for our API
const express = require("express");
require("./db/connection");
const Wishlist = require("./db/models/Wishlist")
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

import { Request, Response } from "express";

async function reqHandler(req: Request, res: Response) : Promise<any> {
    res.send('list');
};

export default reqHandler;