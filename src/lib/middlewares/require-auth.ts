import { NextFunction, Response } from 'express';
import { IUserRequest } from '../../interfaces';
import { UserNotAuthorizedError, catchErrors } from 'lib/errors';

export const requireAuth = catchErrors((req: IUserRequest, __: Response, next: NextFunction) => {
    if (!req.user) {
        throw new UserNotAuthorizedError();
    }
    next();
});