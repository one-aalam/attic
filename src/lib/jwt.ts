import jwt, { SignOptions } from 'jsonwebtoken';
import { InvalidTokenError } from './errors';

const jwtSecretKey = process.env.JWT_SECRET_KEY;
const jwtExpiresIn = process.env.JWT_EXPIRES_IN;


export const createToken = (payload: { [key: string]: any}, options?: SignOptions) =>
  jwt.sign(payload, jwtSecretKey as string, {
    algorithm: 'HS256',
    expiresIn: jwtExpiresIn,
    ...options
  });

export const verifyToken = (token: string): { [key: string]: any } => {
    let payload;
    try {
        payload = jwt.verify(token, jwtSecretKey as string);
    } catch (error) {
        throw new InvalidTokenError();
    }
    return payload as any;
};