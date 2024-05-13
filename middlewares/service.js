const joi = require('joi');
const { responseError } = require('../helper/output');
const { STATUS_CODES } = require('../helper/httpStatusCodes');

module.exports = {
  validateGetListParams: async (req, res, next) => {
    const validationSchema = joi.object({
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
      sortBy: joi
        .string()
        .valid('id', 'created_at', 'updated_at', 'rating')
        .default('id'),
      sortingMethod: joi
        .string()
        .valid('asc', 'desc')
        .default('asc'),
      keyword: joi
        .string()
        .allow('', null)
        .default(''),
    })
    const validationResult = validationSchema.validate(req.query);
    if (validationResult.error) {
      console.log(validationResult.error.message)
      return responseError(res, {
        code: STATUS_CODES.BadRequest,
        message: validationResult.error.message,
      });
    }
    next();
  },
  validateGetById: async (req, res, next) => {
    const validationSchema = joi.object({
      id: joi
        .number()
        .integer()
        .min(1)
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
    next()
  }
}
