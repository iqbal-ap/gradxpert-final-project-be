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
};
