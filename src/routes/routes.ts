// load up our shiny new route for users
import { Express } from 'express';
import { userRoutes } from './users';
import { tokenRoutes } from './tokens';

export const appRouter = (app: Express) => {
    // we've added in a default route here that handles empty routes
    // at the base API url
    app.get('/', (_, res) => res.send('welcome to the development api-server'));

    // run our user route module here to complete the wire up
    userRoutes(app);
    tokenRoutes(app);
};