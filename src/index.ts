import 'dotenv/config'

import express from 'express';
import mongoose from 'mongoose';
import chalk from "chalk";

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
        // Create pretty name for the route
        const pathName: string = (path + '').replace(__dirname, '').replace('routes/', '').split('.')[0];
        console.log('');
        process.stdout.write(`[${chalk.yellowBright('LOAD')}] Loading API route: ${pathName}`);

        try {
            // Import the route file
            const route: Function | undefined = require(path + '').default;
            if (route === undefined) return process.stdout.write(`\r[${chalk.blueBright('SKIP')}] Skipped API route: ${pathName}`);

            // Create the route event and bind the request handler
            expressApp.get(`${pathName}/`, async (req: express.Request, res: express.Response) => {
                try {
                    await route(req, res);
                } catch (err) {
                    res.status(500).send(response(false, 'Internal server error'));
                    console.log(chalk.redBright('Error occured while handling request:\n') + err);
                }
                res.end();
            });

            // Log success
            process.stdout.write(`\r[${chalk.greenBright('OK')}] Loaded API route: ${pathName}                      `);
        } catch (ex) {
            // Log failure
            process.stdout.write(`\r[${chalk.redBright('ERR')}] Failed to load API route: ${pathName}               `);
            console.log('\n' + ex);
        }
    });


    /**
     * Start the API
     */
    expressApp.listen(process.env.API_PORT, () => {
        console.log(`\nAPI Status: ${chalk.greenBright('Running')}\n`);
    });
}

startServer(); // Init the async function