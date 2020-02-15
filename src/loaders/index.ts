import { Express } from 'express';
import { tryDbInit } from 'loaders/db'
import appInit from 'loaders/express'
import { logger } from 'loaders/logger';
import mailer from 'lib/utils/mailer';
import './events';

export const load = async(app: Express) => {
    await tryDbInit();
    logger.info(`Postgres loaded and connected`);

    await mailer.verify((err:any) => {
        if (err) {
            logger.error(err);
        } else {
            logger.info('Mail server is ready for message deliveries');
        }
    })

    appInit(app);
    logger.info(`Express setup for routes and middlewares`);
};