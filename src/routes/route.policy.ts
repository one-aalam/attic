import { IUser } from 'interfaces';

export const isOwner = (user: IUser, resource: IUser) => user.id === resource.id;
export const isAdmin = (user: IUser, _: IUser) => user?.roles && user.roles.includes('ROLE_ADMIN');