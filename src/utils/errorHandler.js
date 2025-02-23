class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

class GraphQLError extends Error {
  constructor(message, code = 'INTERNAL_SERVER_ERROR') {
    super(message);
    this.extensions = { code };
  }
}

module.exports = {
  AppError,
  GraphQLError,
  errorCodes: {
    NOT_FOUND: 'NOT_FOUND',
    BAD_REQUEST: 'BAD_REQUEST',
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN'
  }
}; 