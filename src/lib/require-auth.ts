import { NextFunction, Response } from 'express';
import { IUserRequest } from '../interfaces/';
import { UserNotAuthorizedError } from './errors';

export const requireAuth = (req: IUserRequest, _: Response, next: NextFunction) => {
    if (req.user) {
        next();
    } else {
        throw new UserNotAuthorizedError();
    }
}