import 'dotenv/config'

import express from 'express';
import mongoose from 'mongoose';

import iterateDir from "./utils/folderDir";

let expressApp: express.Application;
let mongooseDb: mongoose.Mongoose;

async function startServer() {
    /**
     * Entry point for the application
     */
    expressApp = express(); // ${process.env.DB_USER}:${process.env.DB_PASSWORD}@
    mongooseDb = await mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/bookstore`);

    expressApp.use(express.json()); // Parse JSON bodies

    /**
     * Iterate through the routes folder and import all the routes
     * 
     * This will create events for all the routes within the express
     * application and will call the request handler function stored
     * in the default export of the route file
     */
    iterateDir('src/routes').forEach((path: String) => {
        const route: Function = require('./routes' + path + '.ts').default;
        console.log('Loading API route: ' + path);
        try {
            expressApp.get(`${path}/`, async (req: express.Request, res: express.Response) => { 
                await route(req, res);
                res.end();
             });
        } catch (ex) {
            console.log('Error loading route: ' + path);
            console.log(ex);
        }
    });


    /**
     * Start the API
     */
    expressApp.listen(process.env.API_PORT, () => {
        console.log('API running on port ' + process.env.API_PORT);
    });
}

startServer(); // Init the async function