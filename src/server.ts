import 'module-alias/register';
import config from 'config';
import 'reflect-metadata';
import express from 'express';

import { tryDbInit } from 'loaders/db'
import appInit from 'loaders/express'

const initExpress = (): void => {
  // create an instance of express to serve our end points
  const app = express();
  // Initialize Express
  appInit(app);
  // finally, launch our server on port 3001.
  app.listen(config.port, err => {
    if (err) {
      console.error(err);
      process.exit(1);
      return;
    }
    console.log('listening on port %s...', config.port);
  });
};

const initApp = async (): Promise<void> => {
  await tryDbInit();
  initExpress();
};

initApp();
