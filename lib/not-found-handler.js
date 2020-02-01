const NotFound = require('./not-found-err');

const notFounder = (err, req, res, next) => {
    if (err instanceof NotFound) {
        console.log('here');
        res.status(404).send(``);
        next();
    } else {
        next(err);
    }
}

module.exports = notFounder;