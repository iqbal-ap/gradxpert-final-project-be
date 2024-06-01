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
      console.log(validationResult.error.message)
      return responseError(res, {
        code: STATUS_CODES.BadRequest,
        message: validationResult.error.message,
      });
    }
    next()
  }
}
