const joi = require('joi');
const { responseError } = require('../helper/output');
const { STATUS_CODES } = require('../helper/httpStatusCodes');
const ERROR = require('../helper/error');

module.exports = {
  validateCreateReviewParams: async (req, res, next) => {
    const validationSchema = joi.object({
      userId: joi
        .number()
        .integer()
        .min(1)
        .required(),
      serviceId: joi
        .number()
        .integer()
        .min(1)
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
        .min(1)
        .required(),
      userId: joi
        .number()
        .integer()
        .min(1)
        .required(),
      serviceId: joi
        .number()
        .integer()
        .min(1)
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
  validateParamReviewId: async (req, res, next) => {
    const validationSchema = joi.object({
      id: joi
        .number()
        .integer()
        .min(1)
        .required(),
    });
    const validationResult = validationSchema.validate(req.params);
    if (validationResult.error) {
      const { error } = validationResult;
      error.code = STATUS_CODES.BadRequest;
      return responseError(res, error);
    }
    next();
  },
}