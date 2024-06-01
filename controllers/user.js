const { UserServices } = require('../services/index');
const { responseError, responseSuccess } = require('../helper/output');
const { STATUS_CODES, STATUS_TEXT } = require('../helper/httpStatusCodes');

module.exports = {
  getReviewHistoryByUserId: async (req, res) => {
    const { id } = req.params;
    const {
      page,
      show, 
      sortBy,
      sortingMethod,
      keyword,
      serviceId,
    } = req.query;
    try {
      const limit = show || 10;
      const offset =  show && page ? show * (page - 1 ) : 0;

      const data = await UserServices.getReviewHistoryByUserId(id, limit, offset, sortBy, sortingMethod, keyword, serviceId);
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