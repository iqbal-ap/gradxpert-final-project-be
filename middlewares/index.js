const AuthMiddleware = require('./auth');
const ServiceMiddleware = require('./service');
const ReviewMiddleware = require('./review');
const UserMiddleware = require('./user');

module.exports = {
  AuthMiddleware,
  ServiceMiddleware,
  ReviewMiddleware,
  UserMiddleware,
}