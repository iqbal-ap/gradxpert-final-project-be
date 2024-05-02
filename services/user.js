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
        phone_number: phoneNumber,
        role: role,
        created_at: new Date(),
        updated_at: new Date(),
      },
        { transaction },
      )
      await transaction.commit()
      return user;
    } catch (error) {
      console.log(error)
      await transaction.rollback()
    }
  },
  getUser: async (username, email) => {
    try {
      const filterObj = {
        email,
        deletedAt: null,
      };
      
      if (username) {
        filterObj.username = username;
      }
      
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
        where: models.Sequelize.Op.or({
          username,
          email,
          deletedAt: null,
        }),
        limit,
        offset,
        order: [[sortBy, sortingMethod]],
      })
      return users;
    } catch (error) {
      console.log(error)
      throw ERROR.INTERNAL_SERVER_ERROR;
    }
  }
}
