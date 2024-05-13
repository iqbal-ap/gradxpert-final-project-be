const express = require('express');
const router = express.Router();
const { AuthMiddleware, ServiceMiddleware, ReviewMiddleware } = require('../middlewares/index');
const { AuthController, ServiceController, ReviewController } = require('../controllers/index')

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
)

// * Service Feature
router.get(
  '/services',
  ServiceMiddleware.validateGetListParams,
  ServiceController.getListServices
)
router.get(
  '/services/:id',
  ServiceMiddleware.validateGetById,
  ServiceController.getServiceById
)

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
)
router.delete(
  '/reviews/:id',
  AuthMiddleware.validateUserToken,
  ReviewMiddleware.validateDeleteReviewParams,
  ReviewController.deleteReview,
)

// * User Feature
router.get(
  'user/:id/reviews',
  AuthMiddleware.validateUserToken,
  // TODO: Add UserMiddleware.validateGetReviewHistoryParams
  // TODO: Add UserController.getReviewHistory
)
module.exports = router;