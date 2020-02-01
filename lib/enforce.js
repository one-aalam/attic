const { UserNotAuthorizedError } = require('./custom-error');

const enforce = policy => (req, res, next) => {
    req.authorize = (resource) => {
        if (!policy(req.user, resource)) {
            res.sendStatus(403);
            throw new UserNotAuthorizedError();
        }
    }
    next();
}

module.exports = enforce;