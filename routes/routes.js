// load up our shiny new route for users
const userRoutes = require('./users');
const tokenRoutes = require('./tokens');

const appRouter = (app) => {
    // we've added in a default route here that handles empty routes
    // at the base API url
    app.get('/', (_, res) => res.send('welcome to the development api-server'));

    // run our user route module here to complete the wire up
    userRoutes(app);
    tokenRoutes(app);
};

module.exports = appRouter;