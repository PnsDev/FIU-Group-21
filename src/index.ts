import 'dotenv/config'

import express from 'express';
import mongoose from 'mongoose';

import iterateDir from "./utils/folderDir";
import response from './utils/response';

let expressApp: express.Application;
let mongooseDb: mongoose.Mongoose;

async function startServer() {
    /**
     * Entry point for the application
     */
    expressApp = express();
    mongooseDb = await mongoose.connect(`mongodb+srv://${process.env.DB_USER !== undefined ? `${process.env.DB_USER}:${process.env.DB_PASSWORD}@` : ''}${process.env.DB_HOST}/bookstore`);

    expressApp.use(express.json()); // Parse JSON bodies

    /**
     * Iterate through the routes folder and import all the routes
     * 
     * This will create events for all the routes within the express
     * application and will call the request handler function stored
     * in the default export of the route file
     */
    iterateDir(__dirname + '/routes').forEach((path: String) => {
        const route: Function | undefined = require(path + '').default;
        if (route === undefined) return;

        // Create pretty name for the route
        const pathName: string = (path + '').replace(__dirname, '').replace('routes/', '').split('.')[0];

        console.log('Loading API route: ' + pathName);
        try {
            expressApp.get(`${pathName}/`, async (req: express.Request, res: express.Response) => { 
                try {
                    await route(req, res);
                } catch (err) {
                    console.log(err);
                    res.status(500).send(response(false, 'Internal server error'));
                }
                res.end();
             });
        } catch (ex) {
            console.log('Error loading route: ' + pathName);
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