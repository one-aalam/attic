import { ErrorRequestHandler, Response, NextFunction, Errback } from 'express';
import { pick } from './choose';
import { CustomError, UserNotAuthorizedError, UserNotFoundError } from './errors';

export const notAuthorizedHandler: ErrorRequestHandler = (
  err: Errback,
  _,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof UserNotAuthorizedError) {
    res.sendStatus(403);
    next();
  } else {
    next(err);
  }
};

export const notFoundHandler: ErrorRequestHandler = (
  err: Errback,
  _,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof UserNotFoundError) {
    res.status(404).send(``);
    next();
  } else {
    next(err);
  }
};

export const customErrorRequestHandler: ErrorRequestHandler = (error: Errback, _req, res: Response, _next: NextFunction) => {
  const isErrorSafeForClient = error instanceof CustomError;
  const clientError = isErrorSafeForClient
    ? pick(error, ['message', 'code', 'status', 'data'])
    : {
        message: 'Something went wrong, please contact our support.',
        code: 'INTERNAL_ERROR',
        status: 500,
        data: {},
      };
  res.status(clientError.status).send({ error: clientError });
};
