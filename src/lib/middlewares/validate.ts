import { RequestHandler, Request, Response, NextFunction } from 'express';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { BadUserInputError } from 'lib/errors/custom-errors';

function validationMiddleware(type: any, skipMissingProperties = false): RequestHandler {
  return (req: Request, _: Response, next: NextFunction) => {
    validate(plainToClass(type, req.body), { skipMissingProperties })
      .then((errors: ValidationError[]) => {
        if (errors.length > 0) {
          const message = errors.map((error: ValidationError) => Object.values(error.constraints)).join(', ');
          next(new BadUserInputError({message}));
        } else {
          next();
        }
      });
  };
}

export default validationMiddleware;