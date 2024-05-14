const { ServiceRepository } = require('../repositories/index');
const ERROR = require('../helper/error')

module.exports = {
  getListServices: async (limit = 10, offset = 0, sortBy = 'id', sortingMethod = 'asc', keyword = '') => {
    try {
      const whereClauses = [{ deletedAt: null }];
      if (keyword) {
        whereClauses.push({ name: { [models.Sequelize.Op.iLike]: `%${keyword}%` } })
      }

      const services = await ServiceRepository.getListServices(limit, offset, sortBy, sortingMethod, keyword, whereClauses);
      return services;
    } catch (error) {
      throw error;
    }
  },
  getServiceById: async (id) => {
    try {
      const service = await ServiceRepository.getServiceById(id);
      return service;
    } catch (error) {
      throw error;
    }
  },
  updateServiceById: async (id, name, description, rating, address, phoneNumber, serviceTypeId, transaction) => {
    try {
      const service = await ServiceRepository.updateServiceById(id, name, description, rating, address, phoneNumber, serviceTypeId, transaction);
      return service;
    } catch (error) {
      throw error;
    }
  }
}
