import 'module-alias/register';
import config from 'config';
import 'reflect-metadata';
// load up the express framework and body-parser helper
import express from 'express';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import compress from 'compression';
import serveStatic from 'serve-static';
import helmet from 'helmet';

import { tryDbInit } from 'loaders/db'


import { logger } from './lib/middlewares/logger';

import { initRoutes } from 'routes';

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
  app.listen(config.port, _ => {
    console.log('listening on port %s...', config.port);
  });
};

const initApp = async (): Promise<void> => {
  await tryDbInit();
  initExpress();
};

initApp();
