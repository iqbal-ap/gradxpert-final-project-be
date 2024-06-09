require('dotenv').config();
const { authenticateDb } = require('../helper/db');
const { ReviewServices } = require('../services/index');
const models  = require('../models/index');
const { STATUS_CODES } = require('../helper/httpStatusCodes');

beforeAll(async () => {
  await authenticateDb(models.DbConnection);
});

describe('getReviewById', () => {
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