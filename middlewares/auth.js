const joi = require('joi');
const ERROR = require('../helper/error');
const ERROR_MSG = require('../helper/customErrorMsgs');
const { responseError } = require('../helper/output');
const { STATUS_CODES } = require('../helper/httpStatusCodes');
const { AuthServices } = require('../services');

module.exports = {
  validateLoginParams: async (req, res, next) => {
    const validationSchema = joi.object({
      username: joi
        .string()
        .optional()
        .allow(null, '')
        .default(null),
      email: joi
        .string()
        .email()
        .required(),
      password: joi
        .string()
        .required(),
    });
    const validationResult = validationSchema.validate(req.body)
    if (validationResult.error) {
      const { error } = validationResult;
      error.code = STATUS_CODES.BadRequest;
      console.log(error)
      return responseError(res, error);
    }
    next()
  },
  validateRegisterParams: async (req, res, next) => {
    const validationSchema = joi.object({
      username: joi
        .string()
        .required(),
      email: joi
        .string()
        .email()
        .required(),
      password: joi
        .string()
        .min(5)
        .required(),
      phoneNumber: joi
        .string()
        .optional()
        .allow('', null)
        .default('') 
    });
    const validationResult = validationSchema.validate(req.body)
    if (validationResult.error) {
      const { error } = validationResult;
      error.code = STATUS_CODES.BadRequest;
      console.log(error)
      return responseError(res, error);
    }
    next()
  },
  validateUserToken: async (req, res, next) => {
    try {
      const token = req.headers?.authorization?.split(' ')[1];
      if (!token) {
        throw new ERROR.UnauthorizedError();
      }
      const user = await AuthServices.authorize(token);
      req.user = user;
      next();
    } catch (error) {
      console.log(error);
      responseError(res, error);
    }
  },
  validateAdminRole: async (req, res, next) => {
    try {
      const { user } = req;
      if (!user) {
        throw new ERROR.NotFoundError(ERROR_MSG.USER_NOT_FOUND);
      }
      if (user.role !== 'admin') {
        throw new ERROR.UnauthorizedError();
      }
      next();
    } catch (error) {
      console.log(error);
      responseError(res, error);
    }
  },
}