const { AuthServices } = require('../services/index')
const { responseSuccess, responseError } = require('../helper/output');
const { STATUS_CODES } = require('../helper/httpStatusCodes');


module.exports = {
  login: async (req, res) => {
    const { username, email, password } = req.body;
    try {
      const data = await AuthServices.authenticate(username, email, password);
      responseSuccess(res, {
        code: STATUS_CODES.OK,
        message: 'Login success',
        data,
      })
    } catch (error) {
      console.log(error)
      responseError(res, error)
    }
  },
  register: async (req, res) => {
    const { username, email, password, phoneNumber } = req.body;
    try {
      const _ = await AuthServices.register(username, email, password, phoneNumber);
      responseSuccess(res, {
        code: STATUS_CODES.Created,
        message: 'Successfully create data',
        data: {},
      })
    } catch (error) {
      console.log(error)
      responseError(res, error)
    }
  }
};