class UserNotAuthorizedError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}

class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}

exports.UserNotAuthorizedError = UserNotAuthorizedError;
exports.NotFoundError = NotFoundError;