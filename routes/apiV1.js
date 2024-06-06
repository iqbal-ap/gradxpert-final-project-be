const express = require('express');
const router = express.Router();
const {
  AuthMiddleware,
  ServiceMiddleware,
  ReviewMiddleware,
  UserMiddleware,
  ServiceTypeMiddleware,
} = require('../middlewares/index');
const {
  AuthController,
  ServiceController,
  ReviewController,
  UserController,
  ServiceTypeController,
} = require('../controllers/index');

//  * Auth Feature
router.post(
  '/login',
  AuthMiddleware.validateLoginParams,
  AuthController.login,
);
router.post(
  '/register',
  AuthMiddleware.validateRegisterParams,
  AuthController.register,
);

// * Service Feature
router.get(
  '/services',
  ServiceMiddleware.validateGetListParams,
  ServiceController.getListServices
);
router.get(
  '/services/:id',
  ServiceMiddleware.validateGetById,
  ServiceController.getServiceById
);
router.get(
  '/services/:id/related',
  ServiceMiddleware.validateParamServiceId,
  ServiceController.getRelatedService
);
router.put(
  '/services/:id',
  AuthMiddleware.validateUserToken,
  AuthMiddleware.validateAdminRole,
  ServiceMiddleware.validateUpdateServiceById,
  ServiceController.updateServiceById,
);
router.post(
  '/services',
  AuthMiddleware.validateUserToken,
  AuthMiddleware.validateAdminRole,
  ServiceMiddleware.validateCreateService,
  ServiceController.createService,
);
router.delete(
  '/services/:id',
  AuthMiddleware.validateUserToken,
  AuthMiddleware.validateAdminRole,
  ServiceMiddleware.validateParamServiceId,
  ServiceController.deleteServiceById,
);

// * Review Feature
router.post(
  '/reviews',
  AuthMiddleware.validateUserToken,
  ReviewMiddleware.validateCreateReviewParams,
  ReviewController.createReview,
);
router.put(
  '/reviews/:id',
  AuthMiddleware.validateUserToken,
  ReviewMiddleware.validateUpdateReviewParams,
  ReviewController.updateReview,
);
router.delete(
  '/reviews/:id',
  AuthMiddleware.validateUserToken,
  ReviewMiddleware.validateParamReviewId,
  ReviewController.deleteReview,
);
router.get(
  '/reviews/:id',
  AuthMiddleware.validateUserToken,
  ReviewMiddleware.validateParamReviewId,
  ReviewController.getReviewById,
);

// * User Feature
router.get(
  '/users/:id/reviews',
  AuthMiddleware.validateUserToken,
  UserMiddleware.validateGetReviewHistoryParams,
  UserController.getReviewHistoryByUserId
);
router.delete(
  '/users/:id',
  AuthMiddleware.validateUserToken,
  AuthMiddleware.validateAdminRole,
  UserMiddleware.validateGetUserById,
  UserController.deleteUserById,
);
router.put(
  '/users/:id',
  AuthMiddleware.validateUserToken,
  AuthMiddleware.validateAdminRole,
  UserMiddleware.validateUpdateUserParams,
  UserController.updateUserById,
);
router.get(
  '/users/:id',
  AuthMiddleware.validateUserToken,
  UserMiddleware.validateGetUserById,
  UserController.getUserById,
);
// * Create user already done when register

// * Service Type Feature
router.get(
  '/service-types/select',
  ServiceTypeController.getSelectListServiceTypes
);
router.get(
  '/service-types/:id',
  AuthMiddleware.validateUserToken,
  ServiceTypeMiddleware.validateGetServiceTypeById,
  ServiceTypeController.getServiceTypeById,
);
router.put(
  '/service-types/:id',
  AuthMiddleware.validateUserToken,
  AuthMiddleware.validateAdminRole,
  ServiceTypeMiddleware.validateUpdateParams,
  ServiceTypeController.updateServiceTypeById,
);
router.post(
  '/service-types',
  AuthMiddleware.validateUserToken,
  AuthMiddleware.validateAdminRole,
  ServiceTypeMiddleware.validateCreateParams,
  ServiceTypeController.createServiceType,
);
router.delete(
  '/service-types/:id',
  AuthMiddleware.validateUserToken,
  AuthMiddleware.validateAdminRole,
  ServiceTypeMiddleware.validateGetServiceTypeById,
  ServiceTypeController.deleteServiceTypeById,
);

module.exports = router;