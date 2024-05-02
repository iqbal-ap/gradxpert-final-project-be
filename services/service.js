const models = require('../models/index');
const ERROR = require('../helper/error')

module.exports = {
  getListServices: async (limit = 10, offset = 0, sortBy = 'id', sortingMethod = 'asc', keyword = '') => {
    try {
      const whereClauses = [{ deleted_at: null }];
      if (keyword) {
        whereClauses.push({ name: { [models.Sequelize.Op.iLike]: `%${keyword}%` } })
      }

      const services = await models.service.findAll({
        where: models.Sequelize.and(whereClauses),
        limit,
        offset,
        order: [[sortBy, sortingMethod]],
        include: [{
          model: models.service_type,
          attributes: ['id', 'name'],
          where: { deletedAt: null },
        }]
      });
      return services;
    } catch (error) {
      console.log(error)
      throw ERROR.INTERNAL_SERVER_ERROR;
    }
  },
  getServiceById: async (id) => {
    try {
      const service = await models.service.findOne({
        where: {
          id,
          deletedAt: null,
        },
        include: [
          {
            model: models.service_type,
            attributes: ['id', 'name'],
            where: { deletedAt: null },
          },
          {
            model: models.review,
            where: { deletedAt: null },
            include: [{
              model: models.user,
              attributes: ['id', 'username', 'email'],
              where: { deletedAt: null }
            }],
          },
        ],
      });
      if (!service) {
        throw ERROR.SERVICE_NOT_FOUND;
      }

      return service;
    } catch (error) {
      console.log(error)
      throw ERROR.INTERNAL_SERVER_ERROR;
    }
  },
  updateServiceById: async (id, name, description, rating, address, phoneNumber, serviceTypeId, transaction) => {
    try {
      const service = await models.service.update(
        {
          name, 
          description,
          rating,
          address,
          phone_number: phoneNumber,
          service_type_id: serviceTypeId,
          updated_at: new Date(),
        },
        { 
          where: {
            id,
            deletedAt: null,
          },
          transaction
        },
      );
      return service;
    } catch (error) {
      console.log(error);
      throw ERROR.INTERNAL_SERVER_ERROR;
      
    }
  }
}
