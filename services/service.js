const models = require('../models/index');
const { ServiceRepository } = require('../repositories/index');
const ERROR = require('../helper/error');

module.exports = {
  getListServices: async (limit = 10, offset = 0, serviceTypeId = 0, sortBy = 'id', sortingMethod = 'asc', keyword = '') => {
    try {
      const whereClauses = [{ deletedAt: null }];
      if (serviceTypeId) {
        whereClauses.push({ serviceTypeId });
      }
      if (keyword) {
        whereClauses.push({ name: { [models.Sequelize.Op.iLike]: `%${keyword}%` } })
      }
      const services = await ServiceRepository.getListServices(limit, offset, sortBy, sortingMethod, whereClauses);
      return services;
    } catch (error) {
      throw error;
    }
  },
  getServiceById: async (id, limit = 10, offset = 0, sortBy = 'id', sortingMethod = 'asc', keyword = '') => {
    try {
      const whereReviewClauses = [{ deletedAt: null }];
      if (keyword) {
        whereReviewClauses.push({ description: { [models.Sequelize.Op.iLike]: `%${keyword}%` } })
      }
      const service = await ServiceRepository.getServiceById(id, limit, offset, sortBy, sortingMethod, whereReviewClauses);
      if (!service) {
        throw new ERROR.NotFoundError('Service');
      }

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
