import { NextFunction, Response } from 'express';
import { IUserRequest } from '../interfaces/';

export const requireAuth = (req: IUserRequest, res: Response, next: NextFunction) => {
    if (req.user) {
        next();
    } else {
        res.sendStatus(401);
    }
}