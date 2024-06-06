const AuthMiddleware = require('./auth');
const ServiceMiddleware = require('./service');
const ReviewMiddleware = require('./review');
const UserMiddleware = require('./user');
const ServiceTypeMiddleware = require('./serviceType');

module.exports = {
  AuthMiddleware,
  ServiceMiddleware,
  ReviewMiddleware,
  UserMiddleware,
  ServiceTypeMiddleware,
}