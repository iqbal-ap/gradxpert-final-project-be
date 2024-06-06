const { ServiceTypeServices } = require('../services/index');
const { responseError, responseSuccess } = require('../helper/output');
const { STATUS_CODES, STATUS_TEXT } = require('../helper/httpStatusCodes');

module.exports = {
  getSelectListServiceTypes: async (req, res) => {
    try {
      const data = await ServiceTypeServices.getSelectListServiceTypes();
      responseSuccess(res, {
        code: STATUS_CODES.OK,
        message: STATUS_TEXT[STATUS_CODES.OK],
        data,
      });
    } catch (error) {
      console.log(error);
      responseError(res, error);
    }
  },
  getServiceTypeById: async (req, res) => {
    const { id } = req.params;
    try {
      const data = await ServiceTypeServices.getServiceTypeById(id);
      responseSuccess(res, {
        code: STATUS_CODES.OK,
        message: STATUS_TEXT[STATUS_CODES.OK],
        data,
      });
    } catch (error) {
      console.log(error);
      responseError(res, error);
    }
  },
  updateServiceTypeById: async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
      const data = await ServiceTypeServices.updateServiceTypeById(id, name);
      responseSuccess(res, {
        code: STATUS_CODES.OK,
        message: STATUS_TEXT[STATUS_CODES.OK],
        data,
      });
    } catch (error) {
      console.log(error);
      responseError(res, error);
    }
  },
  createServiceType: async (req, res) => {
    const { name } = req.body;
    try {
      const data = await ServiceTypeServices.createServiceType(name);
      responseSuccess(res, {
        code: STATUS_CODES.Created,
        message: STATUS_TEXT[STATUS_CODES.OK],
        data,
      });
    } catch (error) {
      console.log(error);
      responseError(res, error);
    }
  },
  deleteServiceTypeById: async (req, res) => {
    const { id } = req.params;
    try {
      const data = await ServiceTypeServices.deleteServiceTypeById(id);
      responseSuccess(res, {
        code: STATUS_CODES.OK,
        message: STATUS_TEXT[STATUS_CODES.OK],
        data,
      });
    } catch (error) {
      console.log(error);
      responseError(res, error);
    }
  },
};
