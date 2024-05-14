const { UserRepository } = require('../repositories/index');
const ERROR = require('../helper/error');

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
  }
}
