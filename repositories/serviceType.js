const models = require('../models/index');
const ERROR = require('../helper/error');
const { STATUS_CODES } = require('../helper/httpStatusCodes');

module.exports = {
  getSelectListServiceTypes: async () => {
    try {
      const services = await models.serviceType.findAll({
        attributes: ['id', 'name'],
        where: { deletedAt: null },
      });
      return services;
    } catch (error) {
      error.code = STATUS_CODES.InternalServerError;
      throw error;
    }
  },
  getServiceTypeById: async (id) => {
    try {
      const serviceType = await models.serviceType.findOne({
        where: {
          id,
          deletedAt: null,
        },
      })
      return serviceType;
    } catch (error) {
      error.code = STATUS_CODES.InternalServerError;
      throw error;
    }
  },
  getServiceTypeByName: async (name) => {
    try {
      const serviceType = await models.serviceType.findOne({
        where: { name },
      })
      return serviceType;
    } catch (error) {
      error.code = STATUS_CODES.InternalServerError;
      throw error;
    }
  },
  updateServiceTypeById: async (id, name) => {
    const transaction = await models.DbConnection.transaction({});
    try {
      const serviceType = await models.serviceType.update(
        {
          name,
          updatedAt: new Date(),
        },
        {
          where: {
            id,
            deletedAt: null,
          },
          transaction,
          returning: true,
        },
      ).then((res) => res[1][0]);
      await transaction.commit();
      return serviceType;
    } catch (error) {
      await transaction.rollback();
      error.code = STATUS_CODES.InternalServerError;
      throw error;
    }
  },
  deleteServiceTypeById: async (id) => {
    const transaction = await models.DbConnection.transaction({});
    try {
      const serviceType = await models.serviceType.update(
        {
          deletedAt: new Date(),
        },
        {
          where: {
            id,
            deletedAt: null,
          },
          transaction,
          returning: true,
        },
      ).then(res => res[1][0]);
      await transaction.commit();
      return serviceType;
    } catch (error) {
      await transaction.rollback();
      error.code = STATUS_CODES.InternalServerError;
      throw error;
    }
  },
  createServiceType: async (name) => {
    const transaction = await models.DbConnection.transaction({});
    try {
      const serviceType = await models.serviceType.create(
        {
          name,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          transaction,
        },
      );
      await transaction.commit();
      return serviceType;
    } catch (error) {
      await transaction.rollback();
      error.code = STATUS_CODES.InternalServerError;
      throw error;
    }
  },
};
