const models = require('../models/index');
const ERROR = require('../helper/error');
const ServiceServices = require('./service');

module.exports = {
  getReviewById: async (id) => {
    try {
      const review = await models.review.findOne({
        where: {
          id,
          deletedAt: null,
        }
      })
      return review;
    } catch (error) {
      console.log(error);
      throw ERROR.INTERNAL_SERVER_ERROR;
    }
  },
  getReviewByServiceId: async (serviceId) => {
    try {
      const review = await models.review.findOne({
        where: {
          serviceId,
          deletedAt: null,
        }
      })
      return review;
    } catch (error) {
      console.log(error);
      throw ERROR.INTERNAL_SERVER_ERROR;
    }
  },
  getTotalRatingByServiceId: async (serviceId) => {
    try {
      const data = await models.DbConnection.query(`
      SELECT
	      COALESCE(SUM(rating), 0)::real as total,
	      COUNT(rating)::integer as "numOfReview"
      FROM reviews r
      WHERE 
        r."serviceId" = :serviceId
        and r."deletedAt" is null
      GROUP BY rating;
      `,
      {
        replacements: { serviceId },
        type: models.Sequelize.QueryTypes.SELECT,
        raw: true,
      })
      return data[0];
    } catch (error) {
      console.log(error);
      throw ERROR.INTERNAL_SERVER_ERROR;
    }
  },
  getTotalRatingByServiceIdExcludeOne: async (serviceId, reviewId) => {
    try {
      const data = await models.DbConnection.query(`
      SELECT
	      SUM(rating)::real as total,
	      COUNT(rating)::integer as "numOfReview"
      FROM reviews r
      WHERE 
        r."serviceId" = :serviceId
        and r.id != :reviewId
        and r."deletedAt" is null;
      `,
      {
        replacements: { serviceId, reviewId },
        type: models.Sequelize.QueryTypes.SELECT,
        raw: true,
      })
      return data[0];
    } catch (error) {
      console.log(error);
      throw ERROR.INTERNAL_SERVER_ERROR;
    }
  },
  createReview: async (userId, serviceId, rating, description = null) => {
    const transaction = await models.DbConnection.transaction({});
    try {
      // * Check whether service exists
      const service = await ServiceServices.getServiceById(serviceId);
      if (!service) {
        throw ERROR.SERVICE_NOT_FOUND;
      }

      // * Check if first review or not
      const existingReview = await module.exports.getReviewByServiceId(serviceId);

      // * Create review
      const review = await models.review.create({
        userId,
        serviceId,
        rating,
        description,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
        { transaction },
      );

      // * Update related service's rating
      let newRating = rating;
      if (existingReview) {
        const { total, numOfReview } = await module.exports.getTotalRatingByServiceId(serviceId);
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
      console.log(error);
      throw ERROR.INTERNAL_SERVER_ERROR;
    }
  },
  updateReview: async (reviewId, userId, serviceId, rating, description = null) => {
    const transaction = await models.DbConnection.transaction({});
    try {
      // * Check whether review exists
      const review = await module.exports.getReviewById(reviewId);
      if (!review) {
        throw ERROR.REVIEW_NOT_FOUND;
      }

      // * Check whether service exists
      const service = await ServiceServices.getServiceById(serviceId);
      if (!service) {
        throw ERROR.SERVICE_NOT_FOUND;
      }

      // * Create review
      const newReview = await models.review.update(
        {
          userId,
          serviceId,
          rating,
          description,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          where: {
            id: reviewId,
            deletedAt: null,
          },
          transaction
        },
      );

      // * Update related service's rating
      const { total, numOfReview } = await module.exports.getTotalRatingByServiceIdExcludeOne(serviceId, reviewId);
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

      await transaction.commit();
      return newReview;
    } catch (error) {
      await transaction.rollback();
      console.log(error);
      throw ERROR.INTERNAL_SERVER_ERROR;
    }
  },
  deleteReview: async (reviewId) => {
    const transaction = await models.DbConnection.transaction({});
    try {
      // * Check whether review exists
      const review = await module.exports.getReviewById(reviewId);
      if (!review) {
        throw ERROR.REVIEW_NOT_FOUND;
      }

      // * Update related service's rating
      const service = await ServiceServices.getServiceById(review.serviceId);
      if (!service) {
        throw ERROR.SERVICE_NOT_FOUND;
      }
      const { total, numOfReview } = await module.exports.getTotalRatingByServiceIdExcludeOne(review.serviceId, reviewId);
      const newRating = total / numOfReview;
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
      const newReview = await models.review.update(
        { deletedAt: new Date() },
        {
          where: {
            id: reviewId,
            deletedAt: null,
          },
          transaction
        },
      );

      await transaction.commit();
      return newReview;
    } catch (error) {
      await transaction.rollback();
      console.log(error);
      throw ERROR.INTERNAL_SERVER_ERROR;
    }
  },
}