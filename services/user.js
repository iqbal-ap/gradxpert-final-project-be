const { UserRepository } = require('../repositories/index');
const ERROR = require('../helper/error');
const models = require('../models');

module.exports = {
  createUser: async (username, email, password, phoneNumber, role) => {
    try {
      const user = await UserRepository.createUser(username, email, password, phoneNumber, role);
      return user;
    } catch (error) {
      throw error
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
      
      const user = await UserRepository.getUser(filterObj);
      return user;
    } catch (error) {
      throw error;
    }
  },
  getListUser: async (username, email, limit = 10, offset = 0, sortBy = 'id', sortingMethod = 'asc') => {
    try {
      const users = await UserRepository.getListUser(username, email, limit, offset, sortBy, sortingMethod);
      return users;
    } catch (error) {
      throw error;
    }
  },
  getReviewHistoryByUserId: async (id, limit = 10, offset = 0, sortBy = 'id', sortingMethod = 'asc', keyword = '', serviceId = 0) => {
    try {
      const whereClauses = [{ deletedAt: null }];
      if (keyword) {
        whereClauses.push({
          [models.Sequelize.Op.or]: [{ description: { [models.Sequelize.Op.iLike]: `%${keyword}%` } }]
        })
      }
      if (serviceId) {
        whereClauses.push({ serviceId });
      }
      const data = await UserRepository.getReviewHistoryByUserId(id, limit, offset, sortBy, sortingMethod, whereClauses);
      return data;
    } catch (error) {
      throw error;
    }
  },
}
