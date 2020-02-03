import express, { Request, Response, Express, Router } from 'express';
import path from 'path';
import bodyParse from 'body-parser';
import multer, {  } from 'multer';

import { IUser, IUserAndAuthFnRequest } from '../interfaces';

const router: Router = express.Router();

const bodyParser = bodyParse.json({
    limit: '100kb'
});
const storage = multer.diskStorage({
    destination: function (_, __, cb) {
      cb(null, path.join(__dirname, '../../uploads'))
    },
    filename: function (_, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
    }
});
const upload = multer({ storage });

import { requireAuth } from '../lib/require-auth';
import { enforce } from '../lib/enforce';
import * as file from '../lib/file';
import { generateId } from '../lib/generate-id';
import { NotFoundError } from '../lib/custom-error';
import { notFoundHandler, notAuthorizedHandler } from '../lib/custom-error-handler';

const dataPath = path.join(__dirname, '../fixtures/users.json');

const getUser = async(req: Request, res: Response) => {
    const users:any = await file.readFile(dataPath);
    const  user = users.find((user: IUser) => user.id === req.params.id);
    if (!user) {
        throw new NotFoundError();
    }
    res.send(user);
};

const getUsers = async(_: Request, res: Response) => {
    const users:any = await file.readFile(dataPath);
    res.send(users);
};

const createUser = async(req: Request, res: Response) => {
    const users: any = await file.readFile(dataPath);
    const id = generateId();
    // @ts-ignore: Uncallable code error
    const avatar = (req.files || []).map((file: Express.Multer.File) => `/uploads/${file.filename}`);
    const newUser = { id, ...req.body, avatar };
    await file.writeFile(JSON.stringify([ ...users, newUser], null, 2), dataPath);
    res.status(201).send(newUser);
}

const updateUser = async(req: IUserAndAuthFnRequest, res: Response) => {
    const users: any = await file.readFile(dataPath);
    const user = users.find((user: IUser) => user.id === req.params.id);
    req.authorize!(user);
    if (!user) {
        throw new NotFoundError();
    }
    // @ts-ignore: Uncallable code error
    const avatar = (req.files || []).map((file: Express.Multer.File) => `/uploads/${file.filename}`);
    const updUsers = users.filter((user: IUser) => user.id !== req.params.id);
    const updUser = { ...user, ...req.body, id: user.id, avatar };
    await file.writeFile(JSON.stringify([...updUsers, updUser], null, 2), dataPath);
    res.status(200).send(updUser);
}

const deleteUser = async(req: IUserAndAuthFnRequest, res: Response) => {
    const users: any = await file.readFile(dataPath);
    const user = users.find((user: IUser) => user.id === req.params.id);
    req.authorize!(user);
    if (!user) {
        throw new NotFoundError();
    }
    const updUsers = users.filter((user: IUser) => user.id !== req.params.id);
    await file.writeFile(JSON.stringify(updUsers, null, 2), dataPath);
    res.sendStatus(204);
}


const updateUserPolicy = (user: IUser, resource: IUser) => user.id === resource.id;
const deleteUserPolicy = updateUserPolicy;


export const userRoutes = (app: Express) => {
    router.use(requireAuth);

    router.get('/', getUsers); // GET ALL
    router.post('/', bodyParser, upload.array('avatar'), createUser); // CREATE

    router.get('/:id', getUser, notFoundHandler); // GET
    router.patch('/:id', enforce(updateUserPolicy), bodyParser, upload.array('avatar'), updateUser, notAuthorizedHandler, notFoundHandler ); // UPDATE
    router.delete('/:id', enforce(deleteUserPolicy), deleteUser, notAuthorizedHandler, notFoundHandler); // DELETE

    app.use('/users', router);
};