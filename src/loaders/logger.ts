import pino from 'pino';
import config from 'config';

const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = pino({ level: config.logs.level, ...{ prettyPrint: isDevelopment ? true : undefined } });