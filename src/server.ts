import 'module-alias/register';
import 'dotenv/config';
import 'reflect-metadata';
// load up the express framework and body-parser helper
import express from 'express';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import compress from 'compression';
import serveStatic from 'serve-static';
import helmet from 'helmet';
import { createConnection, Connection } from 'typeorm';

import * as entities from './entities';

//
import { logger } from './lib/middlewares/logger';

import { initRoutes } from 'routes';

const createDatabaseConnection = (): Promise<Connection> =>
  createConnection({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: Object.values(entities),
    synchronize: true,
  });

const establishDatabaseConnection = async (): Promise<void> => {
  try {
    await createDatabaseConnection();
  } catch (error) {
    console.log(error);
  }
};

const initExpress = (): void => {
  // create an instance of express to serve our end points
  const app = express();

  // configure our express instance with useful global middlewares
  app.use(cors());
  app.use(helmet());
  app.use(cookieParser()); // You've got some cookie? No? You ain't a friend!
  app.use(logger); // we gotta know what's coming our way!
  app.use(compress(/*{ threshold: 0}*/)); // quick performance win! (Not sure? put `threshold = 0`, you curious fella...)
  app.use(serveStatic(path.join(__dirname, 'public')));
  app.use('/uploads', serveStatic(path.join(__dirname, 'uploads')));

  // Initialize routes
  initRoutes(app);
  // finally, launch our server on port 3001.
  app.listen(8080, _ => {
    console.log('listening on port %s...', 8080);
  });
};

const initApp = async (): Promise<void> => {
  await establishDatabaseConnection();
  initExpress();
};

initApp();
