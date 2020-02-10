import { Express } from 'express';
import { tryDbInit } from 'loaders/db'
import appInit from 'loaders/express'
import { logger } from 'loaders/logger';

export const load = async(app: Express) => {
    await tryDbInit();
    logger.info(`Postgres loaded and connected`);

    appInit(app);
    logger.info(`Express setup for routes and middlewares`);
};