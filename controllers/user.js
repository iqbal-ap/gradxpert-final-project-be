const { UserServices } = require('../services/index');
const { responseError, responseSuccess } = require('../helper/output');
const { STATUS_CODES, STATUS_TEXT } = require('../helper/httpStatusCodes');
const { createMetaPagination } = require('../helper/generalUtil');

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

      const { total, data } = await UserServices.getReviewHistoryByUserId(id, limit, offset, sortBy, sortingMethod, keyword, serviceId);
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
  getUserById: async (req, res) => {
    const { id } = req.params;
    try {
      const data = await UserServices.getUser('', '', id);
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
  updateUserById: async (req, res) => {
    const { id } = req.params;
    const { username, email, phoneNumber } = req.body;
    try {
      const data = await UserServices.updateUserById(id, username, email, phoneNumber);
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
  deleteUserById: async (req, res) => {
    const { id } = req.params;
    try {
      const data = await UserServices.deleteUserById(id);
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