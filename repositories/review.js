const models = require('../models/index');
const ERROR = require('../helper/error');

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
      console.log(error);
      throw ERROR.INTERNAL_SERVER_ERROR;
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
      console.log(error);
      throw ERROR.INTERNAL_SERVER_ERROR;
    }
  },
  updateReview: async (userId, rating, description = null, trx) => {
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
      console.log(error);
      throw ERROR.INTERNAL_SERVER_ERROR;
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
      console.log(error);
      throw ERROR.INTERNAL_SERVER_ERROR;
    }
  },
}