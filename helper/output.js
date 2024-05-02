module.exports = {
  responseSuccess: (res, {code, message, data}) => {
    return res.status(code).json({
      status: 'Success',
      code,
      message,
      data
    })
  },
  responseError: (res, {code, message}) => {
    if (code) {
      return res.status(code).json({
        status: 'Error',
        code,
        message,
        data: {},
      });
    }
    return res.status(400).json({
      status: 'Error',
      message,
      data: {},
    });
  },
}