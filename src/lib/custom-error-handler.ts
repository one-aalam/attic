import { ErrorRequestHandler, Response, NextFunction, Errback } from 'express';

import { UserNotAuthorizedError, NotFoundError } from './custom-error';

export const notAuthorizedHandler: ErrorRequestHandler = (err: Errback, _, res: Response, next: NextFunction) => {
    if (err instanceof UserNotAuthorizedError) {
        res.sendStatus(403);
        next();
    } else {
        next(err);
    }
}

export const notFoundHandler: ErrorRequestHandler = (err: Errback, _, res: Response, next: NextFunction) => {
    if (err instanceof NotFoundError) {
        res.status(404).send(``);
        next();
    } else {
        next(err);
    }
}