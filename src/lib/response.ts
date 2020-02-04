import { RequestHandler, NextFunction } from 'express';
import { IAtticExpressResponse } from 'interfaces/core';

export const addRespondToResponse: RequestHandler = (_, res: IAtticExpressResponse, next: NextFunction) => {
  res.respond = (data: any): void => {
    res.status(200).send(data);
  };
  next();
};