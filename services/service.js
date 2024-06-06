const models = require('../models/index');
const ServiceTypeServices = require('./serviceType');
const { ServiceRepository } = require('../repositories/index');
const ERROR = require('../helper/error');
const ERROR_MSG = require('../helper/customErrorMsgs');

module.exports = {
  getListServices: async (limit = 10, offset = 0, serviceTypeId = 0, sortBy = 'id', sortingMethod = 'asc', keyword = '') => {
    try {
      const whereList = ["s.\"deletedAt\" is null"];
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
      const whereList = ["r.\"deletedAt\" is null"];
      if (keyword) {
        whereList.push(`r.\"description\" ilike '%${keyword}%'`) 
      }
      const sorting = `r."${sortBy}" ${sortingMethod}`;
      const whereClauses = whereList.join(' and ').toString();
      const service = await ServiceRepository.getServiceByIdWithCount(id, limit, offset, sorting, whereClauses)
        .then(res => res[0]);
      if (!service?.data) {
        throw new ERROR.NotFoundError(ERROR_MSG.SERVICE_NOT_FOUND);
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
  updateServiceById: async (id, name, description, rating, address, phoneNumber, serviceTypeId, transaction = null) => {
    try {
      const service = await ServiceRepository.getServiceById(id);
      if (!service) {
        throw new ERROR.NotFoundError(ERROR_MSG.SERVICE_NOT_FOUND);
      }
      
      const serviceType = await ServiceTypeServices.getServiceTypeById(serviceTypeId);
      if (!serviceType) {
        throw new ERROR.NotFoundError(ERROR_MSG.SERVICE_TYPE_NOT_FOUND);
      }
      const newService = await ServiceRepository.updateServiceById(id, name, description, rating, address, phoneNumber, serviceTypeId, transaction);
      return newService;
    } catch (error) {
      throw error;
    }
  },
  createService: async (name, description, rating = 0, address, phoneNumber, serviceTypeId) => {
    try {
      const serviceType = await ServiceTypeServices.getServiceTypeById(serviceTypeId);
      if (!serviceType) {
        throw new ERROR.NotFoundError(ERROR_MSG.SERVICE_TYPE_NOT_FOUND);
      }
      const service = await ServiceRepository.createService(name, description, rating, address, phoneNumber, serviceTypeId);
      return service;
    } catch (error) {
      throw error;
    }
  },
  getRelatedService: async (id) => {
    try {
      const service = await ServiceRepository.getServiceById(id);
      if (!service) {
        throw new ERROR.NotFoundError(ERROR_MSG.SERVICE_NOT_FOUND);
      }

      const { serviceTypeId } = service;
      const relatedServices = await ServiceRepository.getRelatedService(id, serviceTypeId);
      return relatedServices;
    } catch (error) {
      throw error;
    }
  },
  deleteServiceById: async (id) => {
    try {
      const service = await ServiceRepository.getServiceById(id);
      if (!service) {
        throw new ERROR.NotFoundError(ERROR_MSG.SERVICE_NOT_FOUND);
      }
      const deletedService = await ServiceRepository.deleteServiceById(id);
      return deletedService;
    } catch (error) {
      throw error;
    }
  },
}
