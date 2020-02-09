import { Express } from 'express';
import users from './users.route';
import auth from './auth.route';
import { customErrorRequestHandler as handleErr } from 'lib/errors/custom-error-handler';
import { RouteNotFoundError } from 'lib/errors';

export const setUpPublicRoutes = (app: Express) => {
    app.get('/', (_, res) => res.send('welcome to the Attic api-server'));
    app.use('/auth', auth);
};

export const setUpPrivateRoutes = (app: Express) => {
    app.use('/users', users);
};

export const setUpErrorHandling = (app: Express) => {

    app.use((req, _res, next) => next(new RouteNotFoundError(req.originalUrl)));
    app.use(handleErr);
};