const joi = require('joi');
const { responseError } = require('../helper/output');
const { STATUS_CODES } = require('../helper/httpStatusCodes');
const ERROR = require('../helper/error');

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
        .valid('id', 'createdAt', 'updatedAt', 'rating', 'name')
        .default('id'),
      sortingMethod: joi
        .string()
        .valid('asc', 'desc')
        .default('asc'),
      keyword: joi
        .string()
        .allow('', null)
        .default(''),
      serviceTypeId: joi
        .number()
        .integer()
        .min(1)
        .optional(),
    })
    const validationResult = validationSchema.validate(req.query);
    if (validationResult.error) {
      const { error } = validationResult;
      error.code = STATUS_CODES.BadRequest;
      console.log(error)
      return responseError(res, error);
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
        .valid('id', 'createdAt', 'updatedAt', 'rating', 'name')
        .default('id'),
      sortingMethod: joi
        .string()
        .valid('asc', 'desc')
        .default('asc'),
      keyword: joi
        .string()
        .allow('', null)
        .default(''),
      serviceTypeId: joi
        .number()
        .integer()
        .min(1)
        .optional(),
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
  validateParamServiceId: async (req, res, next) => {
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
  validateUpdateServiceById: async (req, res, next) => {
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
      description: joi
        .string()
        .optional()
        .allow('', null)
        .default(null),
      rating: joi
        .number()
        .min(0)
        .max(5)
        .required(),
      address: joi
        .string()
        .allow('', null)
        .default(null),
      phoneNumber: joi
        .string()
        .optional()
        .allow('', null)
        .default(null),
      serviceTypeId: joi
        .number()
        .integer()
        .min(1)
        .required()
    });
    const validationResult = validationSchema.validate({
      id: req.params.id,
      ...req.body
    });
    if (validationResult.error) {
      const { error } = validationResult;
      error.code = STATUS_CODES.BadRequest;
      console.log(error)
      return responseError(res, error);
    }
    next()
  },
  validateCreateService: async (req, res, next) => {
    const validationSchema = joi.object({
      name: joi
        .string()
        .min(1)
        .required(),
      description: joi
        .string()
        .optional()
        .allow('', null)
        .default(null),
      rating: joi
        .number()
        .min(0)
        .max(5)
        .optional()
        .allow(null)
        .default(0),
      address: joi
        .string()
        .allow('', null)
        .default(null),
      phoneNumber: joi
        .string()
        .optional()
        .allow('', null)
        .default(null),
      serviceTypeId: joi
        .number()
        .integer()
        .min(1)
        .required()
    });
    const validationResult = validationSchema.validate(req.body);
    if (validationResult.error) {
      const { error } = validationResult;
      error.code = STATUS_CODES.BadRequest;
      console.log(error)
      return responseError(res, error);
    }
    next()
  },
}
