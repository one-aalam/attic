import path from 'path';
const file = require('./file');

import { IUser } from '../interfaces/';

const dataPath = path.join(__dirname, '../fixtures/users.json');

export const byNameAndPassword  = async ({ username, password }: IUser) => {
    const users = await file.read(dataPath);
    return users.find((user: IUser) => user.name === username && user.password === password);
}

export const byUserId  = async ({ id }: IUser) => {
    const users = await file.read(dataPath);
    return users.find((user: IUser) => user.id === id);
}

export const byUserToken = byUserId;

// export const findUserById as byUserToken;


// exports.byNameAndPassword = findUserByNameAndPassword;
// exports.byUserId = findUserById;
// exports.byUserToken = findUserById;