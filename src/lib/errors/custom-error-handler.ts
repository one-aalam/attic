import { ErrorRequestHandler, Response, NextFunction, Errback } from 'express';
import { pick } from 'lib/utils/choose';
import { CustomError } from './custom-errors';

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
