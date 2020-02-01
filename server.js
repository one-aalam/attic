require('dotenv').config();
// load up the express framework and body-parser helper
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const compress = require('compression');
const serveStatic = require('serve-static');
const helmet = require('helmet');

//
const logger = require('./lib/logger');
const basicAuth = require('./lib/basic-auth');
const tokenAuth = require('./lib/token-auth');
const findUsers = require('./lib/find-users');

// create an instance of express to serve our end points
const app = express();

// configure our express instance with useful global middlewares
app.use(helmet());
app.use(cookieParser()); // You've got some cookie? No? You ain't a friend!
app.use(logger); // we gotta know what's coming our way!
app.use(compress(/*{ threshold: 0}*/)); // quick performance win! (Not sure? put `threshold = 0`, you curious fella...)
app.use(serveStatic(path.join(__dirname, 'public')));
app.use('/uploads', serveStatic(path.join(__dirname, 'uploads')));

app.use(tokenAuth(findUsers.byUserToken));
app.use(basicAuth(findUsers.byNameAndPassword));

// this is where we'll handle our various routes from
const routes = require('./routes/routes.js')(app);
// finally, launch our server on port 3001.
const server = app.listen(8080, () => {
    console.log('listening on port %s...', server.address().port);
});