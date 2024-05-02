const joi = require('joi');
const { responseError } = require('../helper/output');
const { STATUS_CODES } = require('../helper/httpStatusCodes');

module.exports = {
  validateCreateReviewParams: async (req, res, next) => {
    const validationSchema = joi.object({
      userId: joi
        .number()
        .integer()
        .required(),
      serviceId: joi
        .number()
        .integer()
        .required(),
      rating: joi
        .number()
        .min(0)
        .max(5)
        .required(),
      description: joi
        .string()
        .optional()
        .allow('', null)
        .default(null),
    });
    const validationResult = validationSchema.validate(req.body);
    if (validationResult.error) {
      console.log(validationResult.error.message)
      return responseError(res, {
        code: STATUS_CODES.BadRequest,
        message: validationResult.error.message,
      });
    }
    next();
  },
  validateUpdateReviewParams: async (req, res, next) => {
    const validationSchema = joi.object({
      id: joi
        .number()
        .integer()
        .required(),
      userId: joi
        .number()
        .integer()
        .required(),
      serviceId: joi
        .number()
        .integer()
        .required(),
      rating: joi
        .number()
        .min(0)
        .max(5)
        .required(),
      description: joi
        .string()
        .optional()
        .allow('', null)
        .default(null),
    });
    const validationResult = validationSchema.validate({
      id: req.params.id,
      ...req.body,
    });
    if (validationResult.error) {
      console.log(validationResult.error.message)
      return responseError(res, {
        code: STATUS_CODES.BadRequest,
        message: validationResult.error.message,
      });
    }
    next();
  },
  validateDeleteReviewParams: async (req, res, next) => {
    const validationSchema = joi.object({
      id: joi
        .number()
        .integer()
        .required(),
    });
    const validationResult = validationSchema.validate(req.params);
    if (validationResult.error) {
      console.log(validationResult.error.message)
      return responseError(res, {
        code: STATUS_CODES.BadRequest,
        message: validationResult.error.message,
      });
    }
    next();
  },
}