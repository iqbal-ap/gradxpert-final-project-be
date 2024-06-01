const models = require('../models/index');
const ERROR = require('../helper/error');

module.exports = {
  getSelectListServiceTypes: async () => {
    try {
      const services = await models.serviceType.findAll({
        attributes: ['id', 'name'],
        where: { deletedAt: null },
      });
      return services;
    } catch (error) {
      console.log(error)
      throw ERROR.INTERNAL_SERVER_ERROR;
    }
  }
};
