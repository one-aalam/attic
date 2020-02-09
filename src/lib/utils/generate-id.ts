import crypto from 'crypto';

export const generateId = () => crypto.randomBytes(8).toString('hex');