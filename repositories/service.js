const models = require('../models/index');
const ERROR = require('../helper/error')

module.exports = {
  getListServices: async (limit = 10, offset = 0, sortBy = 'id', sortingMethod = 'asc', whereClauses = [{ deletedAt: null }]) => {
    try {
      const services = await models.service.findAll({
        where: models.Sequelize.and(whereClauses),
        limit,
        offset,
        order: [[sortBy, sortingMethod]],
        include: [{
          model: models.serviceType,
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
            model: models.serviceType,
            attributes: ['id', 'name'],
            where: { deletedAt: null },
          },
          {
            model: models.review,
            where: { deletedAt: null },
            required: false,
            include: [{
              model: models.user,
              required: false,
              attributes: ['id', 'username', 'email'],
              where: { deletedAt: null }
            }],
          },
        ],
      });
      return service;
    } catch (error) {
      console.log(error)
      throw ERROR.INTERNAL_SERVER_ERROR;
    }
  },
  updateServiceById: async (id, name, description, rating, address, phoneNumber, serviceTypeId, trx) => {
    const transaction = trx ? trx : await models.DbConnection.transaction({});
    try {
      const service = await models.service.update(
        {
          name, 
          description,
          rating,
          address,
          phoneNumber,
          serviceTypeId,
          updatedAt: new Date(),
        },
        { 
          where: {
            id,
            deletedAt: null,
          },
          transaction
        },
      );
      if (trx) return service;
      await transaction.commit();
      return service;
    } catch (error) {
      await transaction.rollback();
      console.log(error);
      throw ERROR.INTERNAL_SERVER_ERROR;      
    }
  }
}
