const { ServiceTypeRepository } = require('../repositories/index');
const ERROR = require('../helper/error');
const ERROR_MSG = require('../helper/customErrorMsgs');

module.exports = {
  getSelectListServiceTypes: async () => {
    try {
      const services = await ServiceTypeRepository.getSelectListServiceTypes();
      return services;
    } catch (error) {
      throw error;
    }
  },
  getServiceTypeById: async (id) => {
    try {
      const serviceType = await ServiceTypeRepository.getServiceTypeById(id);
      if (!serviceType) {
        throw new ERROR.NotFoundError(ERROR_MSG.SERVICE_TYPE_NOT_FOUND);
      }
      return serviceType;
    } catch (error) {
      throw error;
    }
  },
  updateServiceTypeById: async (id, name) => {
    try {
      const serviceType = await ServiceTypeRepository.getServiceTypeById(id);
      if (!serviceType) {
        throw new ERROR.NotFoundError(ERROR_MSG.SERVICE_TYPE_NOT_FOUND);
      }
      const newServiceType = await ServiceTypeRepository.updateServiceTypeById(id, name);
      return newServiceType;
    } catch (error) {
      throw error;
    }
  },
  deleteServiceTypeById: async (id) => {
    try {
      const serviceType = await ServiceTypeRepository.getServiceTypeById(id);
      if (!serviceType) {
        throw new ERROR.NotFoundError(ERROR_MSG.SERVICE_TYPE_NOT_FOUND);
      }
      const deletedServiceType = await ServiceTypeRepository.deleteServiceTypeById(id);
      return deletedServiceType;
    } catch (error) {
      throw error;
    }
  },
  createServiceType: async (name) => {
    try {
      const serviceType = await ServiceTypeRepository.getServiceTypeByName(name);
      if (serviceType) {
        throw new ERROR.BadRequestError(ERROR_MSG.SERVICE_TYPE_ALREADY_EXISTS);
      }
      const newServiceType = await ServiceTypeRepository.createServiceType(name);
      return newServiceType;
    } catch (error) {
      throw error;
    }
  },
};
