import { Response, NextFunction } from 'express';

import { UserNotAuthorizedError } from 'lib/errors';
import { IUserAndAuthFnRequest, IUser } from '../../interfaces';



export const enforce = (policy: Function) => (req: IUserAndAuthFnRequest , _: Response, next: NextFunction) => {
    req.authorize = (resource?: IUser) => {
        if (!policy(req.user, resource)) {
            throw new UserNotAuthorizedError(`${req.user?.username} is not permitted to carry out this action`);
        }
    }
    next();
}