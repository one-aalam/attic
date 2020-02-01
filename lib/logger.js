const morganLogger = require('morgan');

const logger = (req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
};

module.exports = morganLogger('tiny');