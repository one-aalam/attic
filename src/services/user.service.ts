import { User } from 'entities'
import { createEntity, updateEntity, deleteEntity, findEntityOrThrow, findEntity, findOneEntity } from 'lib/utils/typeorm';

export const create = (payload:any) => createEntity(User, payload);
export const update = (id: string, payload:any) => updateEntity(User, id, payload);
export const remove = (id: string) => deleteEntity(User, id);
export const find = (options: any) => findOneEntity(User, options);
export const findOneOrThrow = async (id: any, options: any) =>  findEntityOrThrow(User, id, options);
export const findAll = (options: any) => findEntity(User, options);