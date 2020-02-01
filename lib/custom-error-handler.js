const { UserNotAuthorized, NotFoundError } = require('./custom-error');

const notAuthorizedHandler = (err, req, res, next) => {
    if (err instanceof UserNotAuthorized) {
        res.sendStatus(403);
        next();
    } else {
        next(err);
    }
}

const notFoundHandler = (err, req, res, next) => {
    if (err instanceof NotFoundError) {
        res.status(404).send(``);
        next();
    } else {
        next(err);
    }
}

exports.notAuthorizedHandler = notAuthorizedHandler;
exports.notFoundHandler = notFoundHandler;