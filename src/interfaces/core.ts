import { Response } from 'express';
import { IUser } from './index';

export interface IAtticExpressResponse extends Response {
    respond?: Function;
    authorize?: Function;
    user?: IUser;
}


// https://medium.com/@martin_hotell/10-typescript-pro-tips-patterns-with-or-without-react-5799488d6680
export type EnumLiteralsOf<T extends object> = T[keyof T];

export type AtticErrors = EnumLiteralsOf<typeof AtticErrors>;
export const AtticErrors = Object.freeze({
    'INTERNAL_ERROR': 'INTERNAL_ERROR' as 'INTERNAL_ERROR',
    'ROUTE_NOT_FOUND': 'ROUTE_NOT_FOUND' as 'ROUTE_NOT_FOUND',
    'ENTITY_NOT_FOUND': 'ENTITY_NOT_FOUND' as 'ENTITY_NOT_FOUND',
    'BAD_USER_INPUT': 'BAD_USER_INPUT' as 'BAD_USER_INPUT',
    'INVALID_TOKEN': 'INVALID_TOKEN' as 'INVALID_TOKEN',
    'MISSING_TOKEN': 'MISSING_TOKEN' as 'MISSING_TOKEN',
    'USER_NOT_AUTHORIZED': 'USER_NOT_AUTHORIZED' as 'USER_NOT_AUTHORIZED',
    'USER_NOT_FOUND': 'USER_NOT_FOUND' as 'USER_NOT_FOUND'
});
