import 'dotenv/config'

import express from 'express';

import iterateDir from "./utils/folderDir";

/**
 * Entry point for the application
 */

const app: express.Application = express();


/**
 * Iterate through the routes folder and import all the routes
 * 
 * This will create events for all the routes within the express
 * application and will call the request handler function stored
 * in the default export of the route file
 */
iterateDir('src/routes').forEach((path : String) => {
    const route : Function = require('./routes' + path + '.ts').default;
    console.log('Loading API route: ' + path);
    try {
        app.get(`${path}/`, async (req: express.Request, res: express.Response) => { route(req, res); });
    } catch (ex) {
        console.log('Error loading route: ' + path);
        console.log(ex);
    }
});


/**
 * Start the API
 */
app.listen(process.env.API_PORT, () => {
    console.log('API running on port ' + process.env.API_PORT);
});
