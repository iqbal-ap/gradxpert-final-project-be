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
      const whereList = ['u."deletedAt" is null'];
      const replacementsObj = {};
      let password = 'u.password, ';
      
      if (id) {
        replacementsObj.id = id;
        whereList.push('u.id = :id')
        password = ''
      }
      const whereClauses = whereList.join(' and ').toString();
      const user = await UserRepository.getUser(whereClauses, replacementsObj, password);
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
      const whereList = ['u."deletedAt" is null'];
      const replacementsObj = {};
      let password = 'u.password, ';
      
      if (id) {
        replacementsObj.id = id;
        whereList.push('u.id = :id')
        password = ''
      }
      const whereClauses = whereList.join(' and ').toString();
      const user = await UserRepository.getUser(whereClauses, replacementsObj, password);
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
      const whereList = ['u."deletedAt" is null'];
      const replacementsObj = {};
      let password = 'u.password, ';

      if (email) {
        replacementsObj.email = email;
        whereList.push('u.email = :email');
      }

      if (username) {
        replacementsObj.username = username;
        whereList.push('u.username = :username')
      }
      
      if (id) {
        replacementsObj.id = id;
        whereList.push('u.id = :id')
        password = ''
      }
      
      const whereClauses = whereList.join(' and ').toString();
      const user = await UserRepository.getUser(whereClauses, replacementsObj, password);
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
      const userWhereList = ['u."deletedAt" is null'];
      const replacementsObj = {};
      let password = 'u.password, ';
      
      if (id) {
        replacementsObj.id = id;
        userWhereList.push('u.id = :id')
        password = ''
      }
      const userWhereClauses = userWhereList.join(' and ').toString();
      const user = await UserRepository.getUser(userWhereClauses, replacementsObj, password);
      if (!user) {
        throw new ERROR.NotFoundError(ERROR_MSG.USER_NOT_FOUND);
      }

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
