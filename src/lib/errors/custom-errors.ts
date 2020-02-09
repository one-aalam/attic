/* eslint-disable max-classes-per-file */

type ErrorData = { [key: string]: any };

type ErrorCode =
  | 'INTERNAL_ERROR'
  | 'ROUTE_NOT_FOUND'
  | 'ENTITY_NOT_FOUND'
  | 'BAD_USER_INPUT'
  | 'INVALID_TOKEN'
  | 'MISSING_TOKEN'
  | 'USER_NOT_AUTHORIZED'
  | 'UNPROCESSABLE_ENTITY'
  | 'ATTRIBUTES_IN_USE'
  | 'USER_NOT_FOUND';

export class CustomError extends Error {
  constructor(
    public message: string,
    public code: ErrorCode = 'INTERNAL_ERROR',
    public status: number = 500,
    public data: ErrorData = {},
  ) {
    super();
  }
}

export class RouteNotFoundError extends CustomError {
  constructor(originalUrl: string) {
    super(`Route '${originalUrl}' does not exist.`, 'ROUTE_NOT_FOUND', 404);
    this.name = this.constructor.name;
  }
}

export class EntityNotFoundError extends CustomError {
  constructor(entityName: string) {
    super(`${entityName} not found.`, 'ENTITY_NOT_FOUND', 404);
    this.name = this.constructor.name;
  }
}

export class BadUserInputError extends CustomError {
  constructor(errorData: ErrorData) {
    super('There were validation errors.', 'BAD_USER_INPUT', 400, errorData);
    this.name = this.constructor.name;
  }
}

export class InvalidTokenError extends CustomError {
  constructor(message = 'Authentication token is invalid.') {
    super(message, 'INVALID_TOKEN', 401);
    this.name = this.constructor.name;
  }
}

export class MissingTokenError extends CustomError {
  constructor(message = 'Authentication token is missing.') {
    super(message, 'MISSING_TOKEN', 401);
    this.name = this.constructor.name;
  }
}

export class UserNotAuthorizedError extends CustomError {
  constructor(message: string = 'User is not authorized') {
      super(message, 'USER_NOT_AUTHORIZED', 403);
      this.name = this.constructor.name;
  }
}

export class UserNotFoundError extends CustomError {
  constructor(message: string = 'User is not found') {
      super(message, 'USER_NOT_FOUND', 404);
      this.name = this.constructor.name;
  }
}

export class UnprocessableEntityError extends CustomError {
  constructor(message: string = 'Unprocessable Entity') {
      super(message, 'UNPROCESSABLE_ENTITY', 422);
      this.name = this.constructor.name;
  }
}

export class UsedEntityError extends CustomError {
  constructor(message: string = 'Seems already used') {
      super(message, 'ATTRIBUTES_IN_USE', 409);
      this.name = this.constructor.name;
  }
}
