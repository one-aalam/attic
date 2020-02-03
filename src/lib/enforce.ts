import { Response, NextFunction } from 'express';

import { UserNotAuthorizedError } from './custom-error';
import { IUserAndAuthFnRequest, IUser } from '../interfaces';



export const enforce = (policy: Function) => (req: IUserAndAuthFnRequest , res: Response, next: NextFunction) => {
    req.authorize = (resource: IUser) => {
        if (!policy(req.user, resource)) {
            res.sendStatus(403);
            throw new UserNotAuthorizedError();
        }
    }
    next();
}