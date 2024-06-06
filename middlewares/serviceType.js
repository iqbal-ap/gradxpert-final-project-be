const joi = require('joi');
const { responseError } = require('../helper/output');
const { STATUS_CODES } = require('../helper/httpStatusCodes');
const ERROR = require('../helper/error');

module.exports = {
  validateGetServiceTypeById: async (req, res, next) => {
    const validationSchema = joi.object({
      id: joi
        .number()
        .integer()
        .min(1)
        .required(),
    });
    const validationResult = validationSchema.validate(req.params);
    if (validationResult.error) {
      console.log(new ERROR.BadRequestError(validationResult.error.message))
      return responseError(res, {
        code: STATUS_CODES.BadRequest,
        message: validationResult.error.message,
      });
    }
    next()
  },
  validateUpdateParams: async (req, res, next) => {
    const validationSchema = joi.object({
      id: joi
        .number()
        .integer()
        .min(1)
        .required(),
      name: joi
        .string()
        .min(1)
        .required(),
    });
    const validationResult = validationSchema.validate({
      ...req.params,
      ...req.body
    });
    if (validationResult.error) {
      const { error } = validationResult;
      error.code = STATUS_CODES.BadRequest;
      console.log(error);
      return responseError(res, error);
    }
    next()
  },
  validateCreateParams: async (req, res, next) => {
    const validationSchema = joi.object({
      name: joi
        .string()
        .min(1)
        .required(),
    });
    const validationResult = validationSchema.validate(req.body);
    if (validationResult.error) {
      const { error } = validationResult;
      error.code = STATUS_CODES.BadRequest;
      console.log(error);
      return responseError(res, error);
    }
    next()
  },
};