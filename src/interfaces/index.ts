import { Request } from 'express';

export interface IUser {
    id?: string;
    name?: string;
    username?: string;
    password?: string;
    roles?: string[];
}


export interface IUserRequest extends Request {
    user?: IUser;
}

export interface IJsonParserRequest extends Request {
    body: IUser;
}

export interface IUserAndAuthFnRequest extends IUserRequest {
    authorize?: Function;
}