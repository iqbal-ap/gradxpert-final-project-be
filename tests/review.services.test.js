require('dotenv').config();
const { authenticateDb } = require('../helper/db');
const { ReviewServices } = require('../services/index');
const models  = require('../models/index');
const ERROR = require('../helper/error');
const { STATUS_CODES } = require('../helper/httpStatusCodes');

beforeAll(async () => {
  await authenticateDb(models.DbConnection);
});

describe('getReviewById', () => {
  // describe('given valid params', () => {
  //   test('should return valid data', async () => {
  //     // TODO: Beware with this ids below
  //     for (let id = 20; id < 31; id++) {
  //       const review = await ReviewServices.getReviewById(id);
  //       expect(review).toHaveProperty('id')
  //     }
  //   });
  // });

  describe('given invalid params', () => {
    test('should throw error', async () => {
      // TODO: Beware with this ids below
      for (let id = 20; id < 31; id++) {
        id = `${id}-test`
        const review = await ReviewServices.getReviewById(id).catch(e => e);
        expect(review.code).toBe(STATUS_CODES.InternalServerError)
      }
    })
  });
});

describe('getReviewByServiceId', () => {
  // describe('given valid params', () => {
  //   test('should return valid data', async () => {
  //     // TODO: Beware with this ids below
  //     const serviceIds = [1, 8]
  //     for (const id of serviceIds) {
  //       const review = await ReviewServices.getReviewByServiceId(id);
  //       expect(review).toHaveProperty('id')
  //     }
  //   });
  // });

  describe('given invalid params', () => {
    test('should throw error', async () => {
      // TODO: Beware with this ids below
      const serviceIds = [1, 8]
      for (let id of serviceIds) {
        id = `${id}-test`
        const review = await ReviewServices.getReviewByServiceId(id).catch(e => e);
        expect(review.code).toBe(STATUS_CODES.InternalServerError)
      }
    });
  });
});

describe('getTotalRatingByServiceId', () => {
  // describe('given valid params', () => {
  //   test('should return valid data', async () => {
  //     // TODO: Beware with this ids below
  //     const serviceIds = [1, 8]
  //     for (const id of serviceIds) {
  //       const review = await ReviewServices.getTotalRatingByServiceId(id);
  //       expect(review).toHaveProperty('total');
  //       expect(review).toHaveProperty('numOfReview');
  //     }
  //   });
  // });

  describe('given invalid params', () => {
    test('should throw error', async () => {
      // TODO: Beware with this ids below
      const serviceIds = [1, 8]
      for (let id of serviceIds) {
        id = `${id}-test`
        const review = await ReviewServices.getTotalRatingByServiceId(id).catch(e => e);
        expect(review.code).toBe(STATUS_CODES.InternalServerError)
      }
    });
  });
});

describe('getTotalRatingByServiceIdExcludeOne', () => {
  // describe('given valid params', () => {
  //   test('should return valid data', async () => {
  //     // TODO: Beware with this ids below
  //     const serviceIds = [1, 8]
  //     for (const id of serviceIds) {
  //       const review = await ReviewServices.getTotalRatingByServiceIdExcludeOne(id, id === 1 ? 20 : 24);
  //       expect(review).toHaveProperty('total');
  //       expect(review).toHaveProperty('numOfReview');
  //     }
  //   });
  // });

  describe('given invalid params', () => {
    test('should throw error', async () => {
      // TODO: Beware with this ids below
      const serviceIds = [1, 8]
      for (let id of serviceIds) {
        id = `${id}-test`
        const review = await ReviewServices.getTotalRatingByServiceIdExcludeOne(id, id === 1 ? 20 : 24).catch(e => e);
        expect(review.code).toBe(STATUS_CODES.InternalServerError)
      }
    });
  });
});