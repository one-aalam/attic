import 'module-alias/register';
import config from 'config';
import 'reflect-metadata';
import express from 'express';

import { load } from 'loaders';
import { logger } from 'loaders/logger';

const initApp = async(): Promise<void> => {

  // Instantiate the Express App
  const app = express();

  // Load the loadaaaaaars!
  await load(app);

  // Finally, launch our server on port 3001.
  app.listen(config.port, err => {
    if (err) {
      logger.error(err);
      process.exit(1);
      return;
    }
    logger.info('listening on port %s...', config.port);
  });
};

initApp();
