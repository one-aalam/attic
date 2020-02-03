import 'module-alias/register';
import 'dotenv/config';
// load up the express framework and body-parser helper
import express from 'express';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import compress from 'compression';
import serveStatic from 'serve-static';
import helmet from 'helmet';

//
import { logger }  from './lib/logger';
import { basicAuth } from './lib/basic-auth';
import { tokenAuth } from './lib/token-auth';
import * as findUsers from './lib/find-users';

import { appRouter } from './routes/routes';

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

app.use(tokenAuth(findUsers.byUserToken));
app.use(basicAuth(findUsers.byNameAndPassword));

// this is where we'll handle our various routes from
appRouter(app);
// finally, launch our server on port 3001.
app.listen(8080, (_) => {
    console.log('listening on port %s...', 8080);
});