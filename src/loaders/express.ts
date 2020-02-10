import { Express } from 'express';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import compress from 'compression';
import serveStatic from 'serve-static';
import helmet from 'helmet';

import logger from 'lib/middlewares/logger';
import { initRoutes } from 'routes';

export const appInit = (app: Express) => {
  // Setup heartbeat/health endpoints
  app.get('/status', (_, res) => res.status(200).end());
  app.head('/status', (_, res) => res.status(200).end());
  // Enabled to show real origin IP in logs, if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  app.enable('trust proxy');
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
}

export default appInit;
