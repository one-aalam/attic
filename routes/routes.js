// load up our shiny new route for users
const userRoutes = require('./users');
const authRoutes = require('./auth');

const appRouter = (app) => {
    // we've added in a default route here that handles empty routes
    // at the base API url
    app.get('/', (_, res) => res.send('welcome to the development api-server'));

    // run our user route module here to complete the wire up
    userRoutes(app);
    authRoutes(app);
};

module.exports = appRouter;