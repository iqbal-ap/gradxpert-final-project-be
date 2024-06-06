const { ServiceServices } = require('../services/index');
const { responseError, responseSuccess } = require('../helper/output');
const { STATUS_CODES, STATUS_TEXT } = require('../helper/httpStatusCodes');
const { createMetaPagination } = require('../helper/generalUtil');

module.exports = {
  getListServices: async (req, res) => {
    const { 
      page, 
      show, 
      sortBy, 
      sortingMethod, 
      keyword,
      serviceTypeId,
     } = req.query;
    
    try {
      const limit = show || 10;
      const offset =  show && page ? show * (page - 1) : 0;

      const { total, data } = await ServiceServices.getListServices(limit, offset, serviceTypeId, sortBy, sortingMethod, keyword);
      const meta = createMetaPagination(total, Number(page), Number(show));

      responseSuccess(res, {
        code: STATUS_CODES.OK,
        message: STATUS_TEXT[STATUS_CODES.OK],
        data: { meta, data },
      });
    } catch (error) {
      console.log(error);
      responseError(res, error);
    }
  },
  getServiceById: async (req, res) => {
    const { id } = req.params;
    const { 
      page, 
      show, 
      sortBy, 
      sortingMethod, 
      keyword,
     } = req.query;
    try {
      const limit = Number(show) || 10;
      const offset =  show && page ? show * (page - 1 ) : 0;

      const { total, data } = await ServiceServices.getServiceByIdWithCount(id, limit, offset, sortBy, sortingMethod, keyword);
      const meta = createMetaPagination(total, Number(page), Number(show));

      responseSuccess(res, {
        code: STATUS_CODES.OK,
        message: STATUS_TEXT[STATUS_CODES.OK],
        data: { meta, data },
      });
    } catch (error) {
      console.log(error);
      responseError(res, error);
    }
  },
  getRelatedService: async (req, res) => {
    const { id } = req.params;
    try {
      const data = await ServiceServices.getRelatedService(id);
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
  updateServiceById: async (req, res) => {
    const { id } = req.params;
    const { 
      name,
      description, 
      address, 
      rating, 
      serviceTypeId,
      phoneNumber,
    } = req.body;
    try {
      const data = await ServiceServices.updateServiceById(id, name, description, rating, address, phoneNumber, serviceTypeId);
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
  createService: async (req, res) => {
    const { 
      name,
      description, 
      address,
      serviceTypeId,
      phoneNumber,
    } = req.body;
    const rating = req.body?.rating ? req.body?.rating : 0;
    try {
      const data = await ServiceServices.createService(name, description, rating, address, phoneNumber, serviceTypeId);
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
  deleteServiceById: async (req, res) => {
    const { id } = req.params;
    try {
      const data = await ServiceServices.deleteServiceById(id);
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
}