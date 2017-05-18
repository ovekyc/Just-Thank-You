function APIError(message, statusCode) {
  this.message = message ? message : 'Internal Server Error';
  this.statusCode = statusCode ? statusCode : 500;
  this.stack = Error().stack;
}

APIError.prototype = Object.create(Error.prototype);
APIError.prototype.name = "APIError";

module.exports = APIError;