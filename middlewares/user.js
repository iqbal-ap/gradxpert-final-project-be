const joi = require('joi');
const { responseError } = require('../helper/output');
const { STATUS_CODES } = require('../helper/httpStatusCodes');

module.exports = {
  validateGetReviewHistoryParams: async (req, res, next) => {
    const validationSchema = joi.object({
      id: joi
        .number()
        .integer()
        .min(1)
        .required(),
      page: joi
        .number()
        .integer()
        .min(1)
        .default(1),
      show: joi
        .number()
        .integer()
        .min(1)
        .default(10),
      serviceId: joi
        .number()
        .integer()
        .min(1)
        .optional(),
      sortBy: joi
        .string()
        .valid('id', 'createdAt', 'updatedAt', 'rating')
        .default('id'),
      sortingMethod: joi
        .string()
        .valid('asc', 'desc')
        .default('asc'),
      keyword: joi
        .string()
        .allow('', null)
        .default(''),
    });
    const validationResult = validationSchema.validate({
      ...req.params,
      ...req.query,
    });
    if (validationResult.error) {
      const { error } = validationResult;
      error.code = STATUS_CODES.BadRequest;
      console.log(error)
      return responseError(res, error);
    }
    next()
  },
  validateGetUserById: async (req, res, next) => {
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
      console.log(error)
      return responseError(res, error);
    }
    next()
  },
  validateUpdateUserParams: async (req, res, next) => {
    const validationSchema = joi.object({
      username: joi
        .string()
        .min(1)
        .required(),
      email: joi
        .string()
        .email()
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
}
