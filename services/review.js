const models = require('../models/index');
const { ReviewRepository } = require('../repositories/index');
const ERROR = require('../helper/error');
const ServiceServices = require('./service');
const ERROR_MSG = require('../helper/customErrorMsgs');
const UserServices = require('./user');

module.exports = {
  getReviewById: async (id) => {
    try {
      const review = await ReviewRepository.getReviewById(id);
      if (!review) {
        throw new ERROR.NotFoundError(ERROR_MSG.REVIEW_NOT_FOUND);
      }
      return review;
    } catch (error) {
      throw error;
    }
  },
  getReviewByServiceId: async (serviceId) => {
    try {
      const review = await ReviewRepository.getReviewByServiceId(serviceId);
      return review;
    } catch (error) {
      throw error;
    }
  },
  getTotalRatingByServiceId: async (serviceId) => {
    try {
      const data = await ReviewRepository.getTotalRatingByServiceId(serviceId);
      return data;
    } catch (error) {
      throw error;
    }
  },
  getTotalRatingByServiceIdExcludeOne: async (serviceId, reviewId) => {
    try {
      const data = await ReviewRepository.getTotalRatingByServiceIdExcludeOne(serviceId, reviewId);
      return data;
    } catch (error) {
      throw error;
    }
  },
  createReview: async (userId, serviceId, rating, description = null) => {
    const transaction = await models.DbConnection.transaction({});
    try {
      // * Check whether User exists
      const user = await UserServices.getUser('', '', userId);
      if (!user) {
        throw new ERROR.NotFoundError(ERROR_MSG.USER_NOT_FOUND);
      }

      // * Check whether service exists
      const service = await ServiceServices.getServiceById(serviceId);
      if (!service) {
        throw new ERROR.NotFoundError(ERROR_MSG.SERVICE_NOT_FOUND);
      }

      // * Check if first review or not
      const existingReview = await ReviewRepository.getReviewByServiceId(serviceId);

      // * Create review
      const review = await ReviewRepository.createReview(userId, serviceId, rating, description, transaction)

      // * Update related service's rating
      let newRating = rating;
      if (existingReview) {
        const { total, numOfReview } = await ReviewRepository.getTotalRatingByServiceId(serviceId);
        newRating = (total + rating) / (numOfReview + 1);
      }
      await ServiceServices.updateServiceById(
        serviceId,
        service.name,
        service.description,
        newRating,
        service.address,
        service.phoneNumber,
        service.serviceTypeId,
        transaction,
      );

      await transaction.commit();
      return review;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
  updateReview: async (reviewId, userId, serviceId, rating, description = null) => {
    const transaction = await models.DbConnection.transaction({});
    try {
      // * Check whether review exists
      const review = await ReviewRepository.getReviewById(reviewId);
      if (!review) {
        throw new ERROR.NotFoundError(ERROR_MSG.REVIEW_NOT_FOUND);
      }

      // * Check whether User exists
      const user = await UserServices.getUser('', '', userId);
      if (!user) {
        throw new ERROR.NotFoundError(ERROR_MSG.USER_NOT_FOUND);
      }

      // * Check whether service exists
      const service = await ServiceServices.getServiceById(serviceId);
      if (!service) {
        throw new ERROR.NotFoundError(ERROR_MSG.SERVICE_NOT_FOUND);
      }

      // * Update review
      const newReview = await ReviewRepository.updateReview(reviewId, userId, serviceId, rating, description, transaction);

      // * Update related service's rating
      const { total, numOfReview } = await ReviewRepository.getTotalRatingByServiceIdExcludeOne(serviceId, reviewId);
      const newRating = (total + rating) / (numOfReview + 1);

      await ServiceServices.updateServiceById(
        serviceId,
        service.name,
        service.description,
        newRating,
        service.address,
        service.phoneNumber,
        service.serviceTypeId,
        transaction,
      );

      // * Get new review
      // const newReview = await ReviewRepository.getReviewById(reviewId);
      await transaction.commit();
      return newReview;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
  deleteReview: async (reviewId) => {
    const transaction = await models.DbConnection.transaction({});
    try {
      // * Check whether review exists
      const review = await ReviewRepository.getReviewById(reviewId);
      if (!review) {
        throw new ERROR.NotFoundError(ERROR_MSG.REVIEW_NOT_FOUND);
      }

      // * Update related service's rating
      const service = await ServiceServices.getServiceById(review.serviceId);
      if (!service) {
        throw new ERROR.NotFoundError(ERROR_MSG.SERVICE_NOT_FOUND);
      }
      const { total, numOfReview } = await ReviewRepository.getTotalRatingByServiceIdExcludeOne(review.serviceId, reviewId);
      const newRating = numOfReview ? total / numOfReview : 0;
      await ServiceServices.updateServiceById(
        review.serviceId,
        service.name,
        service.description,
        newRating,
        service.address,
        service.phoneNumber,
        service.serviceTypeId,
        transaction,
      );

      // * Delete review
      const newReview = await ReviewRepository.deleteReview(reviewId, transaction);

      await transaction.commit();
      return newReview;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
}