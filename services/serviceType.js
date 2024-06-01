const models = require('../models/index');
const { ServiceTypeRepository } = require('../repositories/index');

module.exports = {
  getSelectListServiceTypes: async () => {
    try {
      const services = await ServiceTypeRepository.getSelectListServiceTypes();
      return services;
    } catch (error) {
      throw error;
    }
  },
};
