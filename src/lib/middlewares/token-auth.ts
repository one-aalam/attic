import { NextFunction, Response } from 'express';
import { verifyToken } from '../utils/jwt';
import { InvalidTokenError, MissingTokenError, catchErrors } from '../errors';
import { IUserRequest } from '../../interfaces';


export const tokenAuth: Function = (finderFn: Function) => catchErrors(async(req: IUserRequest, _: Response, next: NextFunction) => {
    const header = req.headers.authorization || ''; // @TODO: req.cookies.token
    if (!header) {
        throw new MissingTokenError();
    }
    const [ type, token ] = header.split(' ');
    if (!token) {
        throw new InvalidTokenError('Authentication token not found.');
      }
    if (type === 'Bearer') {
        let payload;
        try {
            payload = verifyToken(token)
        } catch(err) {
            throw new InvalidTokenError();
        }
        const user = await finderFn(payload.userId, {});
        if (!user) {
            throw new InvalidTokenError('Invalid token: User not found.');
        }
        req.user = user.toResponseObject();
    }
    // 'Bearer' has one responsibility: to verify Bearer credentials. It shouldn’t also have the responsibility
    // of blowing up if none are included!
    next();
});