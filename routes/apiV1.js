const express = require('express');
const router = express.Router();
const { AuthMiddleware, ServiceMiddleware, ReviewMiddleware } = require('../middlewares/index');
const { AuthController, ServiceController, ReviewController } = require('../controllers/index')

//  * User Feature
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
  ReviewMiddleware.validateCreateReviewParams,
  AuthMiddleware.validateUserToken,
  ReviewController.createReview,
);
router.put(
  '/reviews/:id',
  ReviewMiddleware.validateUpdateReviewParams,
  AuthMiddleware.validateUserToken,
  ReviewController.updateReview,
)
router.delete(
  '/reviews/:id',
  ReviewMiddleware.validateDeleteReviewParams,
  AuthMiddleware.validateUserToken,
  ReviewController.deleteReview,
)

module.exports = router;