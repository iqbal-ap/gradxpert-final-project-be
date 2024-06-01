const models = require('../models/index');
const { ServiceRepository } = require('../repositories/index');
const ERROR = require('../helper/error');

module.exports = {
  getListServices: async (limit = 10, offset = 0, serviceTypeId = 0, sortBy = 'id', sortingMethod = 'asc', keyword = '') => {
    try {
      const whereList = ["s.\"deletedAt\" is null "];
      if (serviceTypeId) {
        whereList.push(`s.\"serviceTypeId\" = ${serviceTypeId}`);
      }
      if (keyword) {
        whereList.push(`s.\"name\" ilike '%${keyword}%'`) 
      }
      const sorting = `s."${sortBy}" ${sortingMethod}`;
      const whereClauses = whereList.join(' and ').toString();
      
      const servicesWithCount = await ServiceRepository.getListServicesWithCount(limit, offset, sorting, whereClauses)
        .then(res => res[0]);
      return servicesWithCount;
    } catch (error) {
      throw error;
    }
  },
  getServiceByIdWithCount: async (id, limit = 10, offset = 0, sortBy = 'id', sortingMethod = 'asc', keyword = '') => {
    try {
      const whereList = ["r.\"deletedAt\" is null "];
      if (keyword) {
        whereList.push(`r.\"description\" ilike '%${keyword}%'`) 
      }
      const sorting = `r."${sortBy}" ${sortingMethod}`;
      const whereClauses = whereList.join(' and ').toString();
      const service = await ServiceRepository.getServiceByIdWithCount(id, limit, offset, sorting, whereClauses)
        .then(res => res[0]);
      if (!service?.data) {
        throw new ERROR.NotFoundError('Service');
      }

      return service;
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
