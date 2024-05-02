const { STATUS_CODES, STATUS_TEXT } = require('./httpStatusCodes');
module.exports = {
  USER_NOT_FOUND: {
    code: STATUS_CODES.NotFound,
    message: 'User not found',
  },
  SERVICE_NOT_FOUND: {
    code: STATUS_CODES.NotFound,
    message: 'Service not found',
  },
  REVIEW_NOT_FOUND: {
    code: STATUS_CODES.NotFound,
    message: 'Review not found',
  },
  USER_ALREADY_EXISTS: {
    code: STATUS_CODES.BadRequest,
    message: 'User with this username/email is already exists',
  },
  INVALID_USERNAME_PASSWORD: {
    code: STATUS_CODES.BadRequest,
    message: "User's name/email and password is not match"
  },
  INTERNAL_SERVER_ERROR: {
    code: STATUS_CODES.InternalServerError,
    message: STATUS_TEXT[STATUS_CODES.InternalServerError],
  },
  BAD_REQUEST: {
    code: STATUS_CODES.BadRequest,
    message: STATUS_TEXT[STATUS_CODES.BadRequest],
  },
  UNAUTHORIZED: {
    code: STATUS_CODES.Unauthorized,
    message: STATUS_TEXT[STATUS_CODES.Unauthorized],
  }
};
