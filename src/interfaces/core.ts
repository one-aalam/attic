import { Response } from 'express';

export interface IAtticExpressResponse extends Response {
    respond?: Function;
    user?: any
}