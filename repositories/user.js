const models = require('../models/index');
const ERROR = require('../helper/error');

module.exports = {
  createUser: async (username, email, password, phoneNumber, role) => {
    const transaction = await models.DbConnection.transaction({});
    try {
      const user = await models.user.create({
        username,
        password,
        email,
        phoneNumber,
        role: role,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
        { transaction },
      )
      await transaction.commit()
      return user;
    } catch (error) {
      await transaction.rollback()
      console.log(error)
    }
  },
  getUser: async (filterObj) => {
    try {      
      const user = await models.user.findOne({
        where: filterObj,
      });
      return user;
    } catch (error) {
      console.log(error)
      throw ERROR.INTERNAL_SERVER_ERROR;
    }
  },
  getListUser: async (username, email, limit = 10, offset = 0, sortBy = 'id', sortingMethod = 'asc') => {
    try {
      const users = await models.user.findAll({
        where: {
          [models.Sequelize.Op.and] : [
            { deletedAt: null },
            {
              [models.Sequelize.Op.or]: [
                { username },
                { email },
              ]
            }
          ],
        },
        limit,
        offset,
        order: [[sortBy, sortingMethod]],
      })
      return users;
    } catch (error) {
      console.log(error)
      throw ERROR.INTERNAL_SERVER_ERROR;
    }
  },
  getReviewHistoryByUserId: async (id, limit = 10, offset = 0, sortBy = 'id', sortingMethod = 'asc', whereClauses = [{ deletedAt: null }]) => {
    try {
      const data = models.user.findOne({
        attributes: ['id', 'username', 'email'],
        where: {
          id,
          deletedAt: null,
        },
        include: [
          {
            model: models.review,
            where: { [models.Sequelize.Op.and]: whereClauses },
            limit,
            offset,
            order: [[sortBy, sortingMethod]],
            required: false,
            include: [
              {
                model: models.service,
                attributes: ['id', 'name', 'rating', 'description'],
                where: { deletedAt: null },
              }
            ]
          }          
        ],
      })
      return data;
    } catch (error) {
      console.log(error);
      throw ERROR.INTERNAL_SERVER_ERROR;
    }
  }
}
