import path from 'path';
import { readFile } from './file';

import { IUser } from '../interfaces/';

const dataPath = path.join(__dirname, '../fixtures/users.json');

export const byNameAndPassword  = async ({ username, password }: IUser) => {
    const users: any = await readFile(dataPath);
    return users.find((user: IUser) => user.name === username && user.password === password);
}

export const byUserId  = async ({ id }: IUser) => {
    const users: any = await readFile(dataPath);
    return users.find((user: IUser) => user.id === id);
}

export const byUserToken = byUserId;