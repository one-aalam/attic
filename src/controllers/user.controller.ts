import { Request, Response } from 'express';
import * as userService from 'services/user.service';
import {  IUserAndAuthFnRequest } from 'interfaces';
import { UserNotFoundError, UsedEntityError, catchErrors } from 'lib/errors';

export const getOne = catchErrors(async (req: Request, res: Response) => {
    const user = await userService.findOneOrThrow(req.params.id, {});
    res.send(user.toResponseObject());
});

export const getAll = catchErrors(async (req: IUserAndAuthFnRequest, res: Response) => {
    req.authorize && req.authorize();
    const users = await userService.findAll({});
    // @TODO: Achieve filtering through TypeORM
    const usersJson = await users.filter((user:any) => user.roles.indexOf('ROLE_ADMIN') === -1).map((user: any) => user.toResponseObject());
    res.send(usersJson);
});

export const createUser = catchErrors(async (req: Request, res: Response) => {
    const { id, files, ...rest } = req.body;
    // @ts-ignore: Uncallable code error
    const avatarUrl = (files || []).map((file: Express.Multer.File) => `/uploads/${file.filename}`);
    //Try to safe, if fails, that means username already in use
    let user;
    try {
        user = await userService.create({  ...rest, avatarUrl });
    } catch(err) {
        throw new UsedEntityError(`Username or email already in use`);
    }
    res.status(201).send(user?.toResponseObject());
});

export const updateUser = catchErrors(async (req: IUserAndAuthFnRequest, res: Response) => {
    const user = await userService.findOneOrThrow(req.params.id, req.body);
    if (!user) {
        throw new UserNotFoundError();
    }
    // req.authorize!(user);
    // @ts-ignore: Uncallable code error
    const avatarUrl = (req.files || []).map(
        (_file: Express.Multer.File) => `/uploads/${_file.filename}`,
    );
    let _user;
    try {
        _user = await userService.update(req.params.id, { ...req.body, avatarUrl })
    } catch(err) {
        throw new UsedEntityError(`Error commiting changes`);
    }
    res.status(200).send(_user.toResponseObject());
});

export const deleteUser = catchErrors(async (req: IUserAndAuthFnRequest, res: Response) => {
    const user =await userService.findOneOrThrow(req.params.id, req.body);
     // req.authorize!(user);
    if (!user) {
        throw new UserNotFoundError();
    }
    await userService.remove(req.params.id);
    res.sendStatus(204);
});