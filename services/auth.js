require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserServices = require('./user');
const ERROR = require('../helper/error');

module.exports = {
  authenticate: async (username, email, password) => {
    try {
      const user = await UserServices.getUser(username, email);
      if (!user) {
        throw ERROR.USER_NOT_FOUND;
      }

      // Encrypt Password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw ERROR.INVALID_USERNAME_PASSWORD;
      }

      // Generate Token
      const tokenPayload = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      }
      const token = jwt.sign(tokenPayload, process.env.JWT_SECRET_KEY)
       
      return {
        ...tokenPayload,
        token,
      };
    } catch (error) {
      throw error;
    }
  },
  authorize: async (token) => {
    try {
      const decoded = jwt.decode(token, process.env.JWT_SECRET_KEY);
      const user = await UserServices.getUser(decoded.username, decoded.email);
      if (!user) {
        throw ERROR.USER_NOT_FOUND;
      }
      if (user.id !== decoded.id) {
        throw ERROR.UNAUTHORIZED;
      }
      return user;
    } catch (error) {
      throw error;
    }
  },
  register: async (username, email, password, phoneNumber) => {
    try {
      const users = await UserServices.getListUser(username, email);
      if (users.length > 0) {
        throw ERROR.USER_ALREADY_EXISTS;
      }

      // Encrypt Password
      const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT));
      
      // Create user
      const user = await UserServices.createUser(username, email, hashedPassword, phoneNumber);
      return user;
    } catch (error) {
      throw error;
    }
  },
}