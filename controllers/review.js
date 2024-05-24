const { STATUS_CODES } = require('../helper/httpStatusCodes');
const { responseError, responseSuccess } = require('../helper/output');
const { ReviewServices } = require('../services/index');

module.exports = {
  createReview: async (req, res) => {
    const { userId, serviceId, rating, description } = req.body;
    try {
      const data = await ReviewServices.createReview(userId, serviceId, rating, description);
      responseSuccess(res, {
        code: STATUS_CODES.Created,
        message: 'Successfully create data',
        data,
      })
    } catch (error) {
      console.log(error);
      responseError(res, error);
    }
  },
  updateReview: async (req, res) => {
    const { id } = req.params;
    const { userId, serviceId, rating, description } = req.body;
    try {
      const data = await ReviewServices.updateReview(id, userId, serviceId, rating, description);
      responseSuccess(res, {
        code: STATUS_CODES.OK,
        message: 'Successfully update data',
        data,
      })
    } catch (error) {
      console.log(error);
      responseError(res, error);
    }
  },
  deleteReview: async (req, res) => {
    const { id } = req.params;
    try {
      const data = await ReviewServices.deleteReview(id);
      responseSuccess(res, {
        code: STATUS_CODES.OK,
        message: 'Successfully delete data',
        data: {},
      })
    } catch (error) {
      console.log(error);
      responseError(res, error);
    }
  },
}