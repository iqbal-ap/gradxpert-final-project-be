const { ServiceServices } = require('../services/index');
const { responseError, responseSuccess } = require('../helper/output');
const { STATUS_CODES, STATUS_TEXT } = require('../helper/httpStatusCodes');

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
      const offset =  show && page ? show * (page - 1 ) : 0;

      const data = await ServiceServices.getListServices(limit, offset, serviceTypeId, sortBy, sortingMethod, keyword);
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
      const limit = show || 10;
      const offset =  show && page ? show * (page - 1 ) : 0;

      const data = await ServiceServices.getServiceById(id, limit, offset, sortBy, sortingMethod, keyword);
      responseSuccess(res, {
        code: STATUS_CODES.OK,
        message: STATUS_TEXT[STATUS_CODES.OK],
        data,
      });
    } catch (error) {
      console.log(error);
      responseError(res, error);
    }
  }
}