const { UserRepository } = require('../repositories/index');
const ERROR = require('../helper/error');
const ERROR_MSG = require('../helper/customErrorMsgs');
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
  updateUserById: async (id, username, email, password, phoneNumber) => {
    try {
      const scope = 'nonAuth';
      const user = await UserRepository.getUser({ id, deletedAt: null }, scope);
      if (!user) {
        throw new ERROR.NotFoundError(ERROR_MSG.USER_NOT_FOUND);
      }
      const newUser = await UserRepository.updateUserById(id, username, email, phoneNumber);
      return newUser;
    } catch (error) {
      throw error
    }
  },
  deleteUserById: async (id) => {
    try {
      const scope = 'nonAuth';
      const user = await UserRepository.getUser({ id, deletedAt: null }, scope);
      if (!user) {
        throw new ERROR.NotFoundError(ERROR_MSG.USER_NOT_FOUND);
      }
      const newUser = await UserRepository.deleteUserById(id);
      return newUser;
    } catch (error) {
      throw error
    }
  },
  getUser: async (username, email, id = 0) => {
    try {
      const filterObj = { deletedAt: null };

      let scope = 'auth';
      if (email) {
        filterObj.email = email;
      }

      if (username) {
        filterObj.username = username;
      }
      
      if (id) {
        filterObj.id = id;
        scope = 'nonAuth';
      }
      
      const user = await UserRepository.getUser(filterObj, scope);
      if (!user) {
        throw new ERROR.NotFoundError(ERROR_MSG.USER_NOT_FOUND);
      }
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
      const whereList = [
        'r."deletedAt" is null',
        's."deletedAt" is null',
      ];
      if (serviceId) {
        whereList.push(`r.\"serviceId\" = ${serviceId}`);
      }
      if (keyword) {
        whereList.push(`r.\"description\" ilike '%${keyword}%'`) 
      }
      const sorting = `r."${sortBy}" ${sortingMethod}`;
      const whereClauses = whereList.join(' and ').toString();
      
      const reviewHistory = await UserRepository.getReviewHistoryByUserIdWithCount(id, limit, offset, sorting, whereClauses);
      return reviewHistory;
    } catch (error) {
      throw error;
    }
  },
}
