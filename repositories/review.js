const models = require('../models/index');
const ERROR = require('../helper/error');
const { STATUS_CODES } = require('../helper/httpStatusCodes');

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
      error.code = STATUS_CODES.InternalServerError;
      throw error;
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
      error.code = STATUS_CODES.InternalServerError;
      throw error;
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
      error.code = STATUS_CODES.InternalServerError;
      throw error;
    }
  },
  getTotalRatingByServiceIdExcludeOne: async (serviceId, reviewId) => {
    try {
      const data = await models.DbConnection.query(`
      SELECT
	      COALESCE(SUM(rating), 0)::real as total,
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
      error.code = STATUS_CODES.InternalServerError;
      throw error;
    }
  },
  createReview: async (userId, serviceId, rating, description = null, trx) => {
    const transaction = trx ? trx : await models.DbConnection.transaction({});
    try {
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

      if (trx) {
        return review
      };
      await transaction.commit();
      return review;
    } catch (error) {
      await transaction.rollback();
      error.code = STATUS_CODES.InternalServerError;
      throw error;
    }
  },
  updateReview: async (reviewId, userId, serviceId, rating, description = null, trx) => {
    const transaction = trx ? trx : await models.DbConnection.transaction({});
    try {
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

      if (trx) return newReview;
      await transaction.commit();
      return newReview;
    } catch (error) {
      await transaction.rollback();
      error.code = STATUS_CODES.InternalServerError;
      throw error;
    }
  },
  deleteReview: async (reviewId, trx) => {
    const transaction = trx ? trx : await models.DbConnection.transaction({});
    try {
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

      if (trx) return newReview;
      await transaction.commit();
      return newReview;
    } catch (error) {
      await transaction.rollback();
      error.code = STATUS_CODES.InternalServerError;
      throw error;
    }
  },
}