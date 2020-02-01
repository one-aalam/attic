// load up the express framework and body-parser helper
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

//
const logger = require('./lib/logger');
const jsonBodyParser = require('./lib/json-body-parser');

// create an instance of express to serve our end points
const app = express();

// configure our express instance with some body-parser settings
// including handling JSON data
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(logger);
app.use(jsonBodyParser);

// this is where we'll handle our various routes from
const routes = require('./routes/routes.js')(app);

// finally, launch our server on port 3001.
const server = app.listen(8080, () => {
    console.log('listening on port %s...', server.address().port);
});