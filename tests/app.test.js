require('dotenv').config();
const request = require('supertest');
const { authenticateDb } = require('../helper/db');
const app = require('../app');
const models = require('../models/index');
const { generateRandomUserPayloads, generateRandomServiceTypePayloads } = require('../helper/testUtil');

const tokenAdmin = process.env.ADMIN_TOKEN_1;
const tokenUser = process.env.USER_TOKEN;

const Authorization = `Bearer ${tokenAdmin}`;
const validHeader = {
  Authorization,
  'Content-Type': 'application/json',
};
const invalidHeader = {
  'Content-Type': 'application/json',
};
const validUserHeader = {
  Authorization: `Bearer ${tokenUser}`,
  'Content-Type': 'application/json',
};

const createdReviewIds = [];
const userIdsWithReviews = [];
const createdServiceIds = [];
const createdUserIds = [];
const createdServiceTypeIds = [];
const createdServiceTypePayloads = [];

beforeAll(async () => {
  await authenticateDb(models.DbConnection);
});

describe('GET /', () => {
  test('should respond with a 200 status code', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
  });

  test('should specify a json content in the content type header', async () => {
    const response = await request(app).get('/');
    expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
  });
});

// * Auth Feature
describe('POST /api/v1/login', () => {
  const path = '/api/v1/login';

  describe('given a valid username, email, and password', () => {
    test('should respond with a 200 status code', async () => {
      const payloads = [
        {
          username: process.env.ADMIN_USERNAME_1,
          password: process.env.ADMIN_PASSWORD_1,
          email: process.env.ADMIN_EMAIL_1,
        },
        {
          username: process.env.ADMIN_USERNAME_2,
          password: process.env.ADMIN_PASSWORD_2,
          email: process.env.ADMIN_EMAIL_2,
        },
      ]
      for (const payload of payloads) {
        const response = await request(app).post(path).send(payload);
        expect(response.statusCode).toBe(200);
      }
    })
    test('should respond with \'id\', \'username\', \'email\', \'role\', and \'token\'', async () => {
      const payloads = [
        {
          username: process.env.ADMIN_USERNAME_1,
          password: process.env.ADMIN_PASSWORD_1,
          email: process.env.ADMIN_EMAIL_1,
        },
        {
          username: process.env.ADMIN_USERNAME_2,
          password: process.env.ADMIN_PASSWORD_2,
          email: process.env.ADMIN_EMAIL_2,
        },
      ]
      for (const payload of payloads) {
        const response = await request(app).post(path).send(payload);
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data).toHaveProperty('username');
        expect(response.body.data).toHaveProperty('email');
        expect(response.body.data).toHaveProperty('role');
        expect(response.body.data).toHaveProperty('token');
      }
    })
  });

  describe('given an unrecognized user data', () => {
    test('should respond with a 404 status code & empty object data', async () => {
      const payloads = generateRandomUserPayloads();
      for (const payload of payloads) {
        const response = await request(app).post(path).send(payload);
        expect(response.statusCode).toBe(404);
        expect(response.body.data).toStrictEqual({});
      }
    })
  });

  describe('given an unmatch email and password', () => {
    test('should respond with a 400 status code & empty object data', async () => {
      const payloads = [
        // * Unmatch Password
        {
          username: process.env.ADMIN_USERNAME_1,
          password: 'babababa',
          email: process.env.ADMIN_EMAIL_1,
        },
        {
          username: process.env.ADMIN_USERNAME_2,
          password: 'bubububu',
          email: process.env.ADMIN_EMAIL_2,
        },
        // * Unmatch Email
        {
          password: process.env.ADMIN_PASSWORD_1,
          email: 'bibibibi',
        },
        {
          password: process.env.ADMIN_PASSWORD_2,
          email: 'bobobobo',
        },
      ]
      for (const payload of payloads) {
        const response = await request(app).post(path).send(payload);
        expect(response.statusCode).toBe(400);
        expect(response.body.data).toStrictEqual({});
      }
    })
  });

  describe('given an invalid email and password', () => {
    test('should respond with a 400 status code & empty object data', async () => {
      const payloads = [
        // * Case 1: Invalid email
        {
          email: 'some.email',
          password: 'password',
        },
        {
          email: 'some.email@something',
          password: 'password',
        },
        {
          email: '',
          password: 'password',
        },
        {
          password: 'password',
        },
        // * Case 2: Invalid password
        {
          email: 'a.valid@mail.com',
          password: '',
        },
        {
          email: 'a.valid@mail.com',
        }
      ];

      for (payload of payloads) {
        const response = await request(app).post(path).send(payload);
        expect(response.statusCode).toBe(400);
        expect(response.body.data).toStrictEqual({});
      }
    })
  });
});

describe('POST /api/v1/register', () => {
  const path = '/api/v1/register';
  const pathLogin = '/api/v1/login';

  describe('given a valid username, email, and password', () => {
    const payloads = generateRandomUserPayloads();

    test('should respond with a 201 status code and empty data', async () => {
      for (const payload of payloads) {
        const response = await request(app).post(path).send(payload);
        expect(response.statusCode).toBe(201);
        expect(response.body.data).toStrictEqual({});
      }
    });

    test('should able to login successfully', async () => {
      for (const payload of payloads) {
        const response = await request(app).post(pathLogin).send(payload);
        expect(response.statusCode).toBe(200);
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data).toHaveProperty('username');
        expect(response.body.data).toHaveProperty('email');
        expect(response.body.data).toHaveProperty('role');
        expect(response.body.data).toHaveProperty('token');

        createdUserIds.push(response.body.data.id);
      }
    });
  });

  describe('given an invalid payloads', () => {
    test('should respond with a 400 status code & empty object data', async () => {
      const payloads = [
        // * Case 1: Invalid email
        {
          username: 'username',
          email: 'some.email',
          password: 'password',
        },
        {
          username: 'username',
          email: 'some.email@something',
          password: 'password',
        },
        {
          username: 'username',
          email: '',
          password: 'password',
        },
        {
          username: 'username',
          password: 'password',
        },
        // * Case 2: Invalid password
        {
          email: 'a.valid@mail.com',
          password: '',
        },
        {
          email: 'a.valid@mail.com',
        },
        // * Case 3: Invalid username
        {
          username: '',
          email: 'a.valid@mail.com',
          password: 'password',
        },
        {
          email: 'a.valid@mail.com',
          password: 'password',
        },
      ];

      for (payload of payloads) {
        const response = await request(app).post(path).send(payload);
        expect(response.statusCode).toBe(400);
        expect(response.body.data).toStrictEqual({});
      }
    })
  });

  describe('given already exists user data', () => {
    test('should respond with a 400 status code & empty object data', async () => {
      const payloads = [
        {
          username: process.env.ADMIN_USERNAME_1,
          password: process.env.ADMIN_PASSWORD_1,
          email: process.env.ADMIN_EMAIL_1,
        },
        {
          username: process.env.ADMIN_USERNAME_2,
          password: process.env.ADMIN_PASSWORD_2,
          email: process.env.ADMIN_EMAIL_2,
        },
      ];
      for (payload of payloads) {
        const response = await request(app).post(path).send(payload);
        expect(response.statusCode).toBe(400);
        expect(response.body.data).toStrictEqual({});
      }
    });
  });
})

// * Service Feature
describe('GET /api/v1/services', () => {
  const path = '/api/v1/services';

  describe('given default & valid query params', () => {
    test('should respond with a 200 status code', async () => {
      const response = await request(app).get(path);
      expect(response.statusCode).toBe(200);
    });
    test('should respond with defined response\'s properties', async () => {
      const response = await request(app).get(path);
      expect(response.body.data.data[0]).toHaveProperty('id');
      expect(response.body.data.data[0]).toHaveProperty('name');
      expect(response.body.data.data[0]).toHaveProperty('description');
      expect(response.body.data.data[0]).toHaveProperty('rating');
      expect(response.body.data.data[0]).toHaveProperty('phoneNumber');
      expect(response.body.data.data[0]).toHaveProperty('createdAt');
      expect(response.body.data.data[0]).toHaveProperty('updatedAt');
      expect(response.body.data.data[0]).toHaveProperty('deletedAt');
      expect(response.body.data.data[0]).toHaveProperty('serviceTypeId');
      expect(response.body.data.data[0]).toHaveProperty('serviceType');
      expect(response.body.data.data[0]?.serviceType).toHaveProperty('id');
      expect(response.body.data.data[0]?.serviceType).toHaveProperty('name');
    });
  });

  describe('given custom & valid query params', () => {
    test('should respond with a 200 status code', async () => {
      const customQueryParams = [
        // * Custom 'page'
        {
          page: 2,
        },
        {
          page: 3,
        },
        // * Custom 'show'
        {
          show: 5,
        },
        {
          show: 7,
        },
        // * Custom 'sortBy'
        {
          sortBy: 'name',
        },
        {
          sortBy: 'rating',
        },
        // * Custom 'sortingMethod'
        {
          sortingMethod: 'desc',
        },
        // * Custom 'keyword'
        {
          keyword: 'klinik'
        },
        {
          keyword: 'apotik'
        },
        // * Custom all
        {
          page: 2,
          show: 1,
          sortBy: 'createdAt',
          sortingMethod: 'desc',
          keyword: 'rumah sakit',
        },
      ];

      for (const params of customQueryParams) {
        const response = await request(app).get(path).query(params)
        expect(response.statusCode).toBe(200);
        expect(response.body.data.data[0]).toHaveProperty('id');
        expect(response.body.data.data[0]).toHaveProperty('name');
        expect(response.body.data.data[0]).toHaveProperty('description');
        expect(response.body.data.data[0]).toHaveProperty('rating');
        expect(response.body.data.data[0]).toHaveProperty('phoneNumber');
        expect(response.body.data.data[0]).toHaveProperty('createdAt');
        expect(response.body.data.data[0]).toHaveProperty('updatedAt');
        expect(response.body.data.data[0]).toHaveProperty('deletedAt');
        expect(response.body.data.data[0]).toHaveProperty('serviceTypeId');
        expect(response.body.data.data[0]).toHaveProperty('serviceType');
        expect(response.body.data.data[0]?.serviceType).toHaveProperty('id');
        expect(response.body.data.data[0]?.serviceType).toHaveProperty('name');
      }
    });
  });

  describe('given invalid query params', () => {
    test('should respond with a 400 status code & empty array', async () => {
      const customQueryParams = [
        // * Custom 'page'
        {
          page: 0,
        },
        {
          page: -1,
        },
        {
          page: 1.2,
        },
        {
          page: true,
        },
        {
          page: 'asd',
        },
        // * Custom 'show'
        {
          show: 0,
        },
        {
          show: -1,
        },
        {
          show: 2.1,
        },
        {
          show: true,
        },
        {
          show: 'asd',
        },
        // * Custom 'sortBy'
        {
          sortBy: 1,
        },
        {
          sortBy: true,
        },
        {
          sortBy: 'address',
        },
        {
          sortBy: 'phoneNumber',
        },
        // * Custom 'sortingMethod'
        {
          sortingMethod: 'asdasd',
        },
        {
          sortingMethod: 2,
        },
        {
          sortingMethod: false,
        },
        // * Custom all
        {
          page: '4s',
          show: -1.9,
          sortBy: 'createdNotAt',
          sortingMethod: 'desci',
        },
      ];

      for (const params of customQueryParams) {
        const response = await request(app).get(path).query(params)
        expect(response.statusCode).toBe(400);
        expect(response.body.data).toStrictEqual({});
      }
    })
  })
});

describe('POST /api/v1/services', () => {
  const path = '/api/v1/services';

  describe('given valid admin token & valid params', () => {
    test('should respond with a 200 status code & valid response', async () => {
      const payloads = [
        // * Without phoneNumber
        {
          "name": "[TEST] Service - All params - 1",
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "serviceTypeId": 1
        },
        {
          "name": "[TEST] Service - All params - 2",
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "serviceTypeId": 2
        },
        // * Without rating
        {
          "name": "[TEST] Service - All params - 1",
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 3
        },
        {
          "name": "[TEST] Service - All params - 2",
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 1
        },
        // * All params
        {
          "name": "[TEST] Service - All params - 1",
          "rating": 5,
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 1
        },
        {
          "name": "[TEST] Service - All params - 2",
          "rating": 5,
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 2
        },
        // * Without description
        {
          "name": "[TEST] Service - Without description - 1",
          "rating": 5,
          "address": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 3
        },
        {
          "name": "[TEST] Service - Without description - 2",
          "rating": 5,
          "address": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 1
        },
        // * Without address
        {
          "name": "[TEST] Service - Without description - 1",
          "rating": 5,
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 2
        },
        {
          "name": "[TEST] Service - Without description - 2",
          "rating": 5,
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 3
        },
      ];
      for (const payload of payloads) {
        const response = await request(app).post(path).set(validHeader).send(payload);
        expect(response.statusCode).toBe(201)
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data).toHaveProperty('name');
        expect(response.body.data).toHaveProperty('description');
        expect(response.body.data).toHaveProperty('rating');
        expect(response.body.data).toHaveProperty('address');
        expect(response.body.data).toHaveProperty('phoneNumber');
        expect(response.body.data).toHaveProperty('serviceTypeId');

        createdServiceIds.push(response.body.data.id);
      }
    });
  });

  describe('given valid admin token & valid params, but not found \'serviceTypeId\'', () => {
    test('should respond with a 404 status code & empty data', async () => {
      const payloads = [
        // * Without phoneNumber
        {
          "name": "[TEST] Service - All params - 1",
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "serviceTypeId": 130000
        },
        {
          "name": "[TEST] Service - All params - 2",
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "serviceTypeId": 220000
        },
        // * Without rating
        {
          "name": "[TEST] Service - All params - 1",
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 310000
        },
        {
          "name": "[TEST] Service - All params - 2",
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 110000
        },
        // * All params
        {
          "name": "[TEST] Service - All params - 1",
          "rating": 5,
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 100000
        },
        {
          "name": "[TEST] Service - All params - 2",
          "rating": 5,
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 90000
        },
        // * Without description
        {
          "name": "[TEST] Service - Without description - 1",
          "rating": 5,
          "address": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 80000
        },
        {
          "name": "[TEST] Service - Without description - 2",
          "rating": 5,
          "address": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 70000
        },
        // * Without address
        {
          "name": "[TEST] Service - Without description - 1",
          "rating": 5,
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 60000
        },
        {
          "name": "[TEST] Service - Without description - 2",
          "rating": 5,
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 50000
        },
      ];
      for (const payload of payloads) {
        const response = await request(app).post(path).set(validHeader).send(payload);
        expect(response.statusCode).toBe(404)
        expect(response.body.data).toStrictEqual({});
      }
    });
  });

  describe('given valid admin token & invalid params', () => {
    test('should respond with a 400 status code & empty data', async () => {
      const payloads = [
        // * Invalid Rating
        {
          "name": "[TEST] Service - All params - 1",
          "rating": -1,
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 1
        },
        {
          "name": "[TEST] Service - All params - 2",
          "rating": 5.5,
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 2
        },
        {
          "name": "[TEST] Service - All params - 2",
          "rating": '5.5a',
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 2
        },
        // * Invalid name
        {
          "rating": 5,
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 1
        },
        {
          "rating": 5,
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 2
        },
        // * Invalid ServiceTypeId
        {
          "name": "[TEST] Service - All params - 1",
          "rating": 5,
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": '2a'
        },
        {
          "name": "[TEST] Service - All params - 2",
          "rating": 5,
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345"
        },
      ];
      for (const payload of payloads) {
        const response = await request(app).post(path).set(validHeader).send(payload);
        expect(response.statusCode).toBe(400)
        expect(response.body.data).toStrictEqual({});
      }
    });
  });

  describe('given valid user token & valid params', () => {
    test('should respond with a 401 status code & empty data', async () => {
      const payloads = [
        // * Without phoneNumber
        {
          "name": "[TEST] Service - All params - 1",
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "serviceTypeId": 1
        },
        {
          "name": "[TEST] Service - All params - 2",
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "serviceTypeId": 2
        },
        // * Without rating
        {
          "name": "[TEST] Service - All params - 1",
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 3
        },
        {
          "name": "[TEST] Service - All params - 2",
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 1
        },
        // * All params
        {
          "name": "[TEST] Service - All params - 1",
          "rating": 5,
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 1
        },
        {
          "name": "[TEST] Service - All params - 2",
          "rating": 5,
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 2
        },
        // * Without description
        {
          "name": "[TEST] Service - Without description - 1",
          "rating": 5,
          "address": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 3
        },
        {
          "name": "[TEST] Service - Without description - 2",
          "rating": 5,
          "address": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 1
        },
        // * Without address
        {
          "name": "[TEST] Service - Without description - 1",
          "rating": 5,
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 2
        },
        {
          "name": "[TEST] Service - Without description - 2",
          "rating": 5,
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 3
        },
      ];
      for (const payload of payloads) {
        const response = await request(app).post(path).set(validUserHeader).send(payload);
        expect(response.statusCode).toBe(401)
        expect(response.body.data).toStrictEqual({});
      }
    })
  });

  describe('given valid user token & valid params, but not found \'serviceTypeId\'', () => {
    test('should respond with a 401 status code & empty data', async () => {
      const payloads = [
        // * Without phoneNumber
        {
          "name": "[TEST] Service - All params - 1",
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "serviceTypeId": 13
        },
        {
          "name": "[TEST] Service - All params - 2",
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "serviceTypeId": 22
        },
        // * Without rating
        {
          "name": "[TEST] Service - All params - 1",
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 31
        },
        {
          "name": "[TEST] Service - All params - 2",
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 11
        },
        // * All params
        {
          "name": "[TEST] Service - All params - 1",
          "rating": 5,
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 10
        },
        {
          "name": "[TEST] Service - All params - 2",
          "rating": 5,
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 9
        },
        // * Without description
        {
          "name": "[TEST] Service - Without description - 1",
          "rating": 5,
          "address": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 8
        },
        {
          "name": "[TEST] Service - Without description - 2",
          "rating": 5,
          "address": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 7
        },
        // * Without address
        {
          "name": "[TEST] Service - Without description - 1",
          "rating": 5,
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 6
        },
        {
          "name": "[TEST] Service - Without description - 2",
          "rating": 5,
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 5
        },
      ];
      for (const payload of payloads) {
        const response = await request(app).post(path).set(validUserHeader).send(payload);
        expect(response.statusCode).toBe(401)
        expect(response.body.data).toStrictEqual({});
      }
    });
  });

  describe('given valid user token & invalid params', () => {
    test('should respond with a 401 status code & empty data', async () => {
      const payloads = [
        // * Invalid Rating
        {
          "name": "[TEST] Service - All params - 1",
          "rating": -1,
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 1
        },
        {
          "name": "[TEST] Service - All params - 2",
          "rating": 5.5,
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 2
        },
        {
          "name": "[TEST] Service - All params - 2",
          "rating": '5.5a',
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 2
        },
        // * Invalid name
        {
          "rating": 5,
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 1
        },
        {
          "rating": 5,
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 2
        },
        // * Invalid ServiceTypeId
        {
          "name": "[TEST] Service - All params - 1",
          "rating": 5,
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": '2a'
        },
        {
          "name": "[TEST] Service - All params - 2",
          "rating": 5,
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345"
        },
      ];
      for (const payload of payloads) {
        const response = await request(app).post(path).set(validUserHeader).send(payload);
        expect(response.statusCode).toBe(401)
        expect(response.body.data).toStrictEqual({});
      }
    });
  });

  describe('given invalid token & invalid params', () => {
    test('should respond with a 401 status code & empty data', async () => {
      const payloads = [
        // * Invalid Rating
        {
          "name": "[TEST] Service - All params - 1",
          "rating": -1,
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 1
        },
        {
          "name": "[TEST] Service - All params - 2",
          "rating": 5.5,
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 2
        },
        {
          "name": "[TEST] Service - All params - 2",
          "rating": '5.5a',
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 2
        },
        // * Invalid name
        {
          "rating": 5,
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 1
        },
        {
          "rating": 5,
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 2
        },
        // * Invalid ServiceTypeId
        {
          "name": "[TEST] Service - All params - 1",
          "rating": 5,
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": '2a'
        },
        {
          "name": "[TEST] Service - All params - 2",
          "rating": 5,
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345"
        },
        // * All params
        {
          "name": "[TEST] Service - All params - 1",
          "rating": 5,
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 1
        },
        {
          "name": "[TEST] Service - All params - 2",
          "rating": 5,
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 2
        },
      ];
      for (const payload of payloads) {
        const response = await request(app).post(path).set(validUserHeader).send(payload);
        expect(response.statusCode).toBe(401)
        expect(response.body.data).toStrictEqual({});
      }
    });
  });
});

describe('GET /api/v1/services/:id', () => {
  const path = '/api/v1/services'
  describe('given valid id', () => {
    test('should respond with a 200 status code and return with valid params', async () => {
      for (let id = 1; id < 16; id++) {
        const response = await request(app).get(`${path}/${id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.data.data).toHaveProperty('id');
        expect(response.body.data.data).toHaveProperty('name');
        expect(response.body.data.data).toHaveProperty('description');
        expect(response.body.data.data).toHaveProperty('rating');
        expect(response.body.data.data).toHaveProperty('address');
        expect(response.body.data.data).toHaveProperty('phoneNumber');
        expect(response.body.data.data).toHaveProperty('serviceTypeId');
        expect(response.body.data.data).toHaveProperty('serviceType');
        expect(response.body.data.data).toHaveProperty('reviews');
      }
    });
  });

  describe('given invalid id', () => {
    test('should respond with a 400 status code & return empty data', async () => {
      const ids = [1.5, -15, '8f']
      for (const id of ids) {
        const response = await request(app).get(`${path}/${id}`);
        expect(response.statusCode).toBe(400);
        expect(response.body.data).toStrictEqual({});
      }
    });
  });

  describe('given valid but non exists id', () => {
    test('should respond with a 404 status code & return empty data', async () => {
      const ids = [100, 2000, 10000]
      for (const id of ids) {
        const response = await request(app).get(`${path}/${id}`);
        expect(response.statusCode).toBe(404);
        expect(response.body.data).toStrictEqual({});
      }
    });
  });
});

describe('GET /api/v1/services/:id/related', () => {
  function generatePath(id) {
    return `/api/v1/services/${id}/related`;
  }

  describe('given valid id', () => {
    test('should respond with a 200 status code and return with valid params', async () => {
      for (let id = 1; id < 16; id++) {
        const path = generatePath(id);
        const response = await request(app).get(path);
        expect(response.statusCode).toBe(200);
        for (const data of response.body.data) {
          expect(data).toHaveProperty('id');
          expect(data.id).not.toBe(id);
          expect(data).toHaveProperty('name');
          expect(data).toHaveProperty('description');
          expect(data).toHaveProperty('rating');
          expect(data).toHaveProperty('address');
          expect(data).toHaveProperty('phoneNumber');
          expect(data).toHaveProperty('serviceTypeId');
        }
      }
    });
  });

  describe('given invalid id', () => {
    test('should respond with a 400 status code & return empty data', async () => {
      const ids = [1.5, -15, '8f']
      for (const id of ids) {
        const path = generatePath(id);
        const response = await request(app).get(path);
        expect(response.statusCode).toBe(400);
        expect(response.body.data).toStrictEqual({});
      }
    });
  });

  describe('given valid but non exists id', () => {
    test('should respond with a 404 status code & return empty data', async () => {
      const ids = [10000, 20000, 10000]
      for (const id of ids) {
        const path = generatePath(id);
        const response = await request(app).get(path);
        expect(response.statusCode).toBe(404);
        expect(response.body.data).toStrictEqual({});
      }
    });
  });
});

describe('PUT /api/v1/services/:id', () => {
  function generatePath(id) {
    return `/api/v1/services/${id}`;
  }

  describe('given valid admin token & valid params', () => {
    test('should respond with a 200 status code & valid response', async () => {
      const payloads = [
        // * Without phoneNumber
        {
          "name": "[TEST - UPDATED] Service - All params - 1",
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "rating": 5,
          "serviceTypeId": 1
        },
        {
          "name": "[TEST - UPDATED] Service - All params - 2",
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "rating": 5,
          "serviceTypeId": 2
        },
        // * All params
        {
          "name": "[TEST - UPDATED] Service - All params - 1",
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "rating": 5,
          "serviceTypeId": 3
        },
        {
          "name": "[TEST - UPDATED] Service - All params - 2",
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "rating": 5,
          "serviceTypeId": 1
        },
        {
          "name": "[TEST - UPDATED] Service - All params - 1",
          "rating": 5,
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 1
        },
        {
          "name": "[TEST - UPDATED] Service - All params - 2",
          "rating": 5,
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 2
        },
        // * Without description
        {
          "name": "[TEST - UPDATED] Service - Without description - 1",
          "rating": 5,
          "address": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 3
        },
        {
          "name": "[TEST - UPDATED] Service - Without description - 2",
          "rating": 5,
          "address": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 1
        },
        // * Without address
        {
          "name": "[TEST - UPDATED] Service - Without description - 1",
          "rating": 5,
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 2
        },
        {
          "name": "[TEST - UPDATED] Service - Without description - 2",
          "rating": 5,
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 3
        },
      ];
      for (let idx = 0; idx < createdServiceIds.length; idx++) {
        const id = createdServiceIds[idx]
        const payload = payloads[idx];
        const path = generatePath(id);
        const response = await request(app).put(path).set(validHeader).send(payload);
        expect(response.statusCode).toBe(200)
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data).toHaveProperty('name');
        expect(response.body.data).toHaveProperty('description');
        expect(response.body.data).toHaveProperty('rating');
        expect(response.body.data).toHaveProperty('address');
        expect(response.body.data).toHaveProperty('phoneNumber');
        expect(response.body.data).toHaveProperty('serviceTypeId');
      }
    });
  });

  describe('given valid admin token & valid params, but not found \'serviceTypeId\'', () => {
    test('should respond with a 404 status code & empty data', async () => {
      const payloads = [
        // * Without phoneNumber
        {
          "name": "[TEST - UPDATED] Service - All params - 1",
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "rating": 5,
          "serviceTypeId": 130000
        },
        {
          "name": "[TEST - UPDATED] Service - All params - 2",
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "rating": 5,
          "serviceTypeId": 220000
        },
        // * All params
        {
          "name": "[TEST - UPDATED] Service - All params - 1",
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "rating": 5,
          "serviceTypeId": 310000
        },
        {
          "name": "[TEST - UPDATED] Service - All params - 2",
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "rating": 5,
          "serviceTypeId": 110000
        },
        {
          "name": "[TEST - UPDATED] Service - All params - 1",
          "rating": 5,
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 100000
        },
        {
          "name": "[TEST - UPDATED] Service - All params - 2",
          "rating": 5,
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 90000
        },
        // * Without description
        {
          "name": "[TEST - UPDATED] Service - Without description - 1",
          "rating": 5,
          "address": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 80000
        },
        {
          "name": "[TEST - UPDATED] Service - Without description - 2",
          "rating": 5,
          "address": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 70000
        },
        // * Without address
        {
          "name": "[TEST - UPDATED] Service - Without description - 1",
          "rating": 5,
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 60000
        },
        {
          "name": "[TEST - UPDATED] Service - Without description - 2",
          "rating": 5,
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 50000
        },
      ];
      for (let idx = 0; idx < createdServiceIds.length; idx++) {
        const id = createdServiceIds[idx]
        const payload = payloads[idx];
        const path = generatePath(id);
        const response = await request(app).put(path).set(validHeader).send(payload);
        expect(response.statusCode).toBe(404)
        expect(response.body.data).toStrictEqual({});
      }
    });
  });

  describe('given valid admin token & valid params, but not found \'id\'', () => {
    test('should respond with a 404 status code & empty data', async () => {
      const payloads = [
        // * Without phoneNumber
        {
          "name": "[TEST - UPDATED] Service - All params - 1",
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "rating": 5,
          "serviceTypeId": 13
        },
        {
          "name": "[TEST - UPDATED] Service - All params - 2",
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "rating": 5,
          "serviceTypeId": 22
        },
        // * All params
        {
          "name": "[TEST - UPDATED] Service - All params - 1",
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "rating": 5,
          "serviceTypeId": 31
        },
        {
          "name": "[TEST - UPDATED] Service - All params - 2",
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "rating": 5,
          "serviceTypeId": 11
        },
        {
          "name": "[TEST - UPDATED] Service - All params - 1",
          "rating": 5,
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 10
        },
        {
          "name": "[TEST - UPDATED] Service - All params - 2",
          "rating": 5,
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 9
        },
        // * Without description
        {
          "name": "[TEST - UPDATED] Service - Without description - 1",
          "rating": 5,
          "address": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 8
        },
        {
          "name": "[TEST - UPDATED] Service - Without description - 2",
          "rating": 5,
          "address": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 7
        },
        // * Without address
        {
          "name": "[TEST - UPDATED] Service - Without description - 1",
          "rating": 5,
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 6
        },
        {
          "name": "[TEST - UPDATED] Service - Without description - 2",
          "rating": 5,
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 5
        },
      ];
      for (let idx = 0; idx < createdServiceIds.length; idx++) {
        const id = createdServiceIds[idx]
        const payload = payloads[idx];
        const path = generatePath(id * 100000);
        const response = await request(app).put(path).set(validHeader).send(payload);
        expect(response.statusCode).toBe(404)
        expect(response.body.data).toStrictEqual({});
      }
    });
  });

  describe('given valid admin token & invalid params', () => {
    test('should respond with a 400 status code & empty data', async () => {
      const payloads = [
        // * Invalid Rating
        {
          "name": "[TEST - UPDATED] Service - All params - 1",
          "rating": -1,
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 1
        },
        {
          "name": "[TEST - UPDATED] Service - All params - 2",
          "rating": 5.5,
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 2
        },
        {
          "name": "[TEST - UPDATED] Service - All params - 2",
          "rating": '5.5a',
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 2
        },
        // * Invalid name
        {
          "rating": 5,
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 1
        },
        {
          "rating": 5,
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 2
        },
        // * Invalid ServiceTypeId
        {
          "name": "[TEST - UPDATED] Service - All params - 1",
          "rating": 5,
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": '2a'
        },
        {
          "name": "[TEST - UPDATED] Service - All params - 2",
          "rating": 5,
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345"
        },
        // * Invalid Rating
        {
          "name": "[TEST - UPDATED] Service - All params - 1",
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "rating": 5.5,
          "serviceTypeId": 31
        },
        {
          "name": "[TEST - UPDATED] Service - All params - 1",
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "rating": -1,
          "serviceTypeId": 31
        },
        {
          "name": "[TEST - UPDATED] Service - All params - 1",
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 31
        },
      ];
      for (let idx = 0; idx < createdServiceIds.length; idx++) {
        const id = createdServiceIds[idx]
        const payload = payloads[idx];
        const path = generatePath(id);
        const response = await request(app).put(path).set(validHeader).send(payload);
        expect(response.statusCode).toBe(400)
        expect(response.body.data).toStrictEqual({});
      }
    });
  });

  describe('given valid user token & valid params', () => {
    test('should respond with a 401 status code & empty data', async () => {
      const payloads = [
        // * Without phoneNumber
        {
          "name": "[TEST] Service - All params - 1",
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "serviceTypeId": 1
        },
        {
          "name": "[TEST] Service - All params - 2",
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "serviceTypeId": 2
        },
        // * Without rating
        {
          "name": "[TEST] Service - All params - 1",
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 3
        },
        {
          "name": "[TEST] Service - All params - 2",
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 1
        },
        // * All params
        {
          "name": "[TEST] Service - All params - 1",
          "rating": 5,
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 1
        },
        {
          "name": "[TEST] Service - All params - 2",
          "rating": 5,
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 2
        },
        // * Without description
        {
          "name": "[TEST] Service - Without description - 1",
          "rating": 5,
          "address": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 3
        },
        {
          "name": "[TEST] Service - Without description - 2",
          "rating": 5,
          "address": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 1
        },
        // * Without address
        {
          "name": "[TEST] Service - Without description - 1",
          "rating": 5,
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 2
        },
        {
          "name": "[TEST] Service - Without description - 2",
          "rating": 5,
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 3
        },
      ];
      for (let idx = 0; idx < createdServiceIds.length; idx++) {
        const id = createdServiceIds[idx]
        const payload = payloads[idx];
        const path = generatePath(id);
        const response = await request(app).put(path).set(validUserHeader).send(payload);
        expect(response.statusCode).toBe(401)
        expect(response.body.data).toStrictEqual({});
      }
    })
  });

  describe('given valid user token & valid params, but not found \'serviceTypeId\'', () => {
    test('should respond with a 401 status code & empty data', async () => {
      const payloads = [
        // * Without phoneNumber
        {
          "name": "[TEST] Service - All params - 1",
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "serviceTypeId": 13
        },
        {
          "name": "[TEST] Service - All params - 2",
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "serviceTypeId": 22
        },
        // * Without rating
        {
          "name": "[TEST] Service - All params - 1",
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 31
        },
        {
          "name": "[TEST] Service - All params - 2",
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 11
        },
        // * All params
        {
          "name": "[TEST] Service - All params - 1",
          "rating": 5,
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 10
        },
        {
          "name": "[TEST] Service - All params - 2",
          "rating": 5,
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 9
        },
        // * Without description
        {
          "name": "[TEST] Service - Without description - 1",
          "rating": 5,
          "address": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 8
        },
        {
          "name": "[TEST] Service - Without description - 2",
          "rating": 5,
          "address": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 7
        },
        // * Without address
        {
          "name": "[TEST] Service - Without description - 1",
          "rating": 5,
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 6
        },
        {
          "name": "[TEST] Service - Without description - 2",
          "rating": 5,
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 5
        },
      ];
      for (let idx = 0; idx < createdServiceIds.length; idx++) {
        const id = createdServiceIds[idx]
        const payload = payloads[idx];
        const path = generatePath(id);
        const response = await request(app).put(path).set(validUserHeader).send(payload);
        expect(response.statusCode).toBe(401)
        expect(response.body.data).toStrictEqual({});
      }
    });
  });

  describe('given valid user token & invalid params', () => {
    test('should respond with a 401 status code & empty data', async () => {
      const payloads = [
        // * Invalid Rating
        {
          "name": "[TEST] Service - All params - 1",
          "rating": -1,
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 1
        },
        {
          "name": "[TEST] Service - All params - 2",
          "rating": 5.5,
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 2
        },
        {
          "name": "[TEST] Service - All params - 2",
          "rating": '5.5a',
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 2
        },
        // * Invalid name
        {
          "rating": 5,
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 1
        },
        {
          "rating": 5,
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 2
        },
        // * Invalid ServiceTypeId
        {
          "name": "[TEST] Service - All params - 1",
          "rating": 5,
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": '2a'
        },
        {
          "name": "[TEST] Service - All params - 2",
          "rating": 5,
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345"
        },
      ];
      for (let idx = 0; idx < createdServiceIds.length; idx++) {
        const id = createdServiceIds[idx]
        const payload = payloads[idx];
        const path = generatePath(id);
        const response = await request(app).put(path).set(validUserHeader).send(payload);
        expect(response.statusCode).toBe(401)
        expect(response.body.data).toStrictEqual({});
      }
    });
  });

  describe('given invalid token & invalid params', () => {
    test('should respond with a 401 status code & empty data', async () => {
      const payloads = [
        // * Invalid Rating
        {
          "name": "[TEST] Service - All params - 1",
          "rating": -1,
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 1
        },
        {
          "name": "[TEST] Service - All params - 2",
          "rating": 5.5,
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 2
        },
        {
          "name": "[TEST] Service - All params - 2",
          "rating": '5.5a',
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 2
        },
        // * Invalid name
        {
          "rating": 5,
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 1
        },
        {
          "rating": 5,
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 2
        },
        // * Invalid ServiceTypeId
        {
          "name": "[TEST] Service - All params - 1",
          "rating": 5,
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": '2a'
        },
        {
          "name": "[TEST] Service - All params - 2",
          "rating": 5,
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345"
        },
        // * All params
        {
          "name": "[TEST] Service - All params - 1",
          "rating": 5,
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 1
        },
        {
          "name": "[TEST] Service - All params - 2",
          "rating": 5,
          "address": "Lorem Ipsum Dolor Amet",
          "description": "Lorem Ipsum Dolor Amet",
          "phoneNumber": "(0271) 12345",
          "serviceTypeId": 2
        },
      ];
      for (let idx = 0; idx < createdServiceIds.length; idx++) {
        const id = createdServiceIds[idx]
        const payload = payloads[idx];
        const path = generatePath(id);
        const response = await request(app).put(path).set(validUserHeader).send(payload);
        expect(response.statusCode).toBe(401)
        expect(response.body.data).toStrictEqual({});
      }
    });
  });
});

describe('DELETE /api/v1/services/:id', () => {
  function generatePath(id) {
    return `/api/v1/services/${id}`;
  }

  describe('given valid admin token and valid params', () => {
    test('should respond with a 200 status code and valid response', async () => {
      for (const id of createdServiceIds) {
        const path = generatePath(id);
        const response = await request(app).delete(path).set(validHeader);
        expect(response.statusCode).toBe(200)
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data).toHaveProperty('name');
        expect(response.body.data).toHaveProperty('description');
        expect(response.body.data).toHaveProperty('rating');
        expect(response.body.data).toHaveProperty('address');
        expect(response.body.data).toHaveProperty('phoneNumber');
        expect(response.body.data).toHaveProperty('serviceTypeId');
      }
    });
  });

  describe('given valid admin token and valid params but not found \'serviceId\'', () => {
    test('should respond with a 404 status code and empty data', async () => {
      for (const id of createdServiceIds) {
        const path = generatePath(id * 10000);
        const response = await request(app).delete(path).set(validHeader);
        expect(response.statusCode).toBe(404)
        expect(response.body.data).toStrictEqual({});
      }
    });
  });

  describe('given valid admin token and invalid params', () => {
    test('should respond with a 400 status code and empty data', async () => {
      for (const id of createdServiceIds) {
        const path = generatePath(`${id}abc`);
        const response = await request(app).delete(path).set(validHeader);
        expect(response.statusCode).toBe(400)
        expect(response.body.data).toStrictEqual({});
      }
    });
  });

  describe('given valid user token and valid params', () => {
    test('should respond with a 401 status code and empty data', async () => {
      for (const id of createdServiceIds) {
        const path = generatePath(id);
        const response = await request(app).delete(path).set(validUserHeader);
        expect(response.statusCode).toBe(401)
        expect(response.body.data).toStrictEqual({});
      }
    });
  });

  describe('given valid user token and valid params but not found \'serviceId\'', () => {
    test('should respond with a 401 status code and empty data', async () => {
      for (const id of createdServiceIds) {
        const path = generatePath(id * 10000);
        const response = await request(app).delete(path).set(validUserHeader);
        expect(response.statusCode).toBe(401)
        expect(response.body.data).toStrictEqual({});
      }
    });
  });

  describe('given valid user token and invalid params', () => {
    test('should respond with a 401 status code and empty data', async () => {
      for (const id of createdServiceIds) {
        const path = generatePath(`${id}abc`);
        const response = await request(app).delete(path).set(validUserHeader);
        expect(response.statusCode).toBe(401)
        expect(response.body.data).toStrictEqual({});
      }
    });
  });

  describe('given invalid token and valid params', () => {
    test('should respond with a 401 status code and empty data', async () => {
      for (const id of createdServiceIds) {
        const path = generatePath(id);
        const response = await request(app).delete(path).set(invalidHeader);
        expect(response.statusCode).toBe(401)
        expect(response.body.data).toStrictEqual({});
      }
    });
  });

  describe('given invalid token and valid params but not found \'serviceId\'', () => {
    test('should respond with a 401 status code and empty data', async () => {
      for (const id of createdServiceIds) {
        const path = generatePath(id * 10000);
        const response = await request(app).delete(path).set(invalidHeader);
        expect(response.statusCode).toBe(401)
        expect(response.body.data).toStrictEqual({});
      }
    });
  });

  describe('given invalid token and invalid params', () => {
    test('should respond with a 401 status code and empty data', async () => {
      for (const id of createdServiceIds) {
        const path = generatePath(`${id}abc`);
        const response = await request(app).delete(path).set(invalidHeader);
        expect(response.statusCode).toBe(401)
        expect(response.body.data).toStrictEqual({});
      }
    });
  });
});

// * Review Feature
describe('POST /api/v1/reviews', () => {
  const path = '/api/v1/reviews';

  describe('given valid auth token and valid params', () => {
    test('should respond with a 201 status code and return valid params', async () => {
      const payloads = [
        // * valid 'userId'
        {
          userId: 1,
          serviceId: 1,
          rating: 5,
          description: 'test - so far so good'
        },
        {
          userId: 2,
          serviceId: 1,
          rating: 5,
          description: 'test - so far so good'
        },
        // * Valid 'serviceId'
        {
          userId: 3,
          serviceId: 3,
          rating: 5,
          description: 'test - so far so good'
        },
        {
          userId: 2,
          serviceId: 8,
          rating: 5,
          description: 'test - so far so good'
        },
        // * Valid 'rating'
        {
          userId: 2,
          serviceId: 8,
          rating: 1.2,
          description: 'test - so far so good'
        },
        {
          userId: 3,
          serviceId: 8,
          rating: 3,
          description: 'test - so far so good'
        },
        // * Valid 'description'
        {
          userId: 1,
          serviceId: 8,
          rating: 3,
          description: ''
        },
      ];
      for (const payload of payloads) {
        const response = await request(app).post(path).set(validHeader).send(payload);
        expect(response.statusCode).toBe(201);
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data).toHaveProperty('userId');
        expect(response.body.data).toHaveProperty('serviceId');
        expect(response.body.data).toHaveProperty('rating');
        expect(response.body.data).toHaveProperty('description');

        createdReviewIds.push(response.body.data.id);
      }
    });
  });

  describe('given valid auth token and not found \'serviceId\'', () => {
    test('should respond with a 404 status code and return emptu object', async () => {
      const payloads = [
        // * valid 'userId'
        {
          userId: 1,
          serviceId: 1,
          rating: 5,
          description: 'test - so far so good'
        },
        {
          userId: 2,
          serviceId: 1,
          rating: 5,
          description: 'test - so far so good'
        },
        // * Valid 'serviceId'
        {
          userId: 5,
          serviceId: 3,
          rating: 5,
          description: 'test - so far so good'
        },
        {
          userId: 2,
          serviceId: 8,
          rating: 5,
          description: 'test - so far so good'
        },
        // * Valid 'rating'
        {
          userId: 2,
          serviceId: 8,
          rating: 1.2,
          description: 'test - so far so good'
        },
        {
          userId: 3,
          serviceId: 8,
          rating: 3,
          description: 'test - so far so good'
        },
        // * Valid 'description'
        {
          userId: 4,
          serviceId: 8,
          rating: 3,
          description: ''
        },
      ];
      for (const payload of payloads) {
        const { serviceId } = payload;
        payload.serviceId = serviceId * 100000
        const response = await request(app).post(path).set(validHeader).send(payload);
        expect(response.statusCode).toBe(404);
        expect(response.body.data).toStrictEqual({});
      }
    });
  });

  describe('given valid auth token and invalid params', () => {
    test('should respond with a 400 status code and return emptu object', async () => {
      const payloads = [
        // * invalid 'userId'
        {
          userId: -100,
          serviceId: 1,
          rating: 5,
          description: 'test - so far so good'
        },
        {
          userId: 2.90,
          serviceId: 1,
          rating: 5,
          description: 'test - so far so good'
        },
        {
          userId: '2we',
          serviceId: 1,
          rating: 5,
          description: 'test - so far so good'
        },
        // * invalid 'serviceId'
        {
          userId: 5,
          serviceId: -3,
          rating: 5,
          description: 'test - so far so good'
        },
        {
          userId: 2,
          serviceId: 8.5,
          rating: 5,
          description: 'test - so far so good'
        },
        {
          userId: 2,
          serviceId: '-55peh',
          rating: 5,
          description: 'test - so far so good'
        },
        // * invalid 'rating'
        {
          userId: 2,
          serviceId: 8,
          rating: -1.2,
          description: 'test - so far so good'
        },
        {
          userId: 3,
          serviceId: 8,
          rating: 5.01,
          description: 'test - so far so good'
        },
        {
          userId: 3,
          serviceId: 8,
          rating: '3q',
          description: 'test - so far so good'
        },
      ];
      for (const payload of payloads) {
        const response = await request(app).post(path).set(validHeader).send(payload);
        expect(response.statusCode).toBe(400);
        expect(response.body.data).toStrictEqual({});
      }
    });
  });

  describe('given invalid auth token and valid params', () => {
    test('should respond with a 401 status code and return empty object', async () => {
      const payloads = [
        // * valid 'userId'
        {
          userId: 1,
          serviceId: 1,
          rating: 5,
          description: 'test - so far so good'
        },
        {
          userId: 2,
          serviceId: 1,
          rating: 5,
          description: 'test - so far so good'
        },
        // * Valid 'serviceId'
        {
          userId: 5,
          serviceId: 3,
          rating: 5,
          description: 'test - so far so good'
        },
        {
          userId: 2,
          serviceId: 8,
          rating: 5,
          description: 'test - so far so good'
        },
        // * Valid 'rating'
        {
          userId: 2,
          serviceId: 8,
          rating: 1.2,
          description: 'test - so far so good'
        },
        {
          userId: 3,
          serviceId: 8,
          rating: 3,
          description: 'test - so far so good'
        },
        // * Valid 'description'
        {
          userId: 4,
          serviceId: 8,
          rating: 3,
          description: ''
        },
      ];
      for (const payload of payloads) {
        const response = await request(app).post(path).set(invalidHeader).send(payload);
        expect(response.statusCode).toBe(401);
        expect(response.body.data).toStrictEqual({});
      }
    });
  })
  describe('given invalid auth token and invalid params', () => {
    test('should respond with a 401 status code and return empty object', async () => {
      const payloads = [
        // * invalid 'userId'
        {
          userId: -100,
          serviceId: 1,
          rating: 5,
          description: 'test - so far so good'
        },
        {
          userId: 2.90,
          serviceId: 1,
          rating: 5,
          description: 'test - so far so good'
        },
        {
          userId: '2we',
          serviceId: 1,
          rating: 5,
          description: 'test - so far so good'
        },
        // * invalid 'serviceId'
        {
          userId: 5,
          serviceId: -3,
          rating: 5,
          description: 'test - so far so good'
        },
        {
          userId: 2,
          serviceId: 8.5,
          rating: 5,
          description: 'test - so far so good'
        },
        {
          userId: 2,
          serviceId: '-55peh',
          rating: 5,
          description: 'test - so far so good'
        },
        // * invalid 'rating'
        {
          userId: 2,
          serviceId: 8,
          rating: -1.2,
          description: 'test - so far so good'
        },
        {
          userId: 3,
          serviceId: 8,
          rating: 5.01,
          description: 'test - so far so good'
        },
        {
          userId: 3,
          serviceId: 8,
          rating: '3q',
          description: 'test - so far so good'
        },
      ];
      for (const payload of payloads) {
        const response = await request(app).post(path).set(invalidHeader).send(payload);
        expect(response.statusCode).toBe(401);
        expect(response.body.data).toStrictEqual({});
      }
    })
  })
});

describe('PUT /api/v1/reviews/:id', () => {
  const path = '/api/v1/reviews';

  describe('given valid auth token and valid params', () => {
    test('should respond with a 200 status code and return valid params', async () => {
      const payloads = [
        // * valid 'userId'
        {
          userId: 1,
          serviceId: 1,
          rating: 5,
          description: 'test - so far so good'
        },
        {
          userId: 2,
          serviceId: 1,
          rating: 5,
          description: 'test - so far so good'
        },
        // * Valid 'serviceId'
        {
          userId: 3,
          serviceId: 3,
          rating: 5,
          description: 'test - so far so good'
        },
        {
          userId: 2,
          serviceId: 8,
          rating: 5,
          description: 'test - so far so good'
        },
        // * Valid 'rating'
        {
          userId: 2,
          serviceId: 8,
          rating: 1.2,
          description: 'test - so far so good'
        },
        {
          userId: 3,
          serviceId: 8,
          rating: 3,
          description: 'test - so far so good'
        },
        // * Valid 'description'
        {
          userId: 1,
          serviceId: 8,
          rating: 3,
          description: ''
        },
      ];
      for (let i = 0; i < createdReviewIds.length; i++) {
        const id = createdReviewIds[i];
        const payload = payloads[i];
        const response = await request(app).put(`${path}/${id}`).set(validHeader).send(payload);
        expect(response.statusCode).toBe(200);
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data).toHaveProperty('serviceId');
        expect(response.body.data).toHaveProperty('userId');
        expect(response.body.data).toHaveProperty('description');
        expect(response.body.data).toHaveProperty('rating');

        userIdsWithReviews.push(response.body.data.userId);
      }
    });
  });

  describe('given valid auth token and not found \'reviewId\'', () => {
    test('should respond with a 404 status code and return empty object data', async () => {
      const payloads = [
        // * valid 'userId'
        {
          userId: 1,
          serviceId: 1,
          rating: 5,
          description: 'test - so far so good'
        },
        {
          userId: 2,
          serviceId: 1,
          rating: 5,
          description: 'test - so far so good'
        },
        // * Valid 'serviceId'
        {
          userId: 1,
          serviceId: 3,
          rating: 5,
          description: 'test - so far so good'
        },
        {
          userId: 2,
          serviceId: 8,
          rating: 5,
          description: 'test - so far so good'
        },
        // * Valid 'rating'
        {
          userId: 2,
          serviceId: 8,
          rating: 1.2,
          description: 'test - so far so good'
        },
        {
          userId: 3,
          serviceId: 8,
          rating: 3,
          description: 'test - so far so good'
        },
        // * Valid 'description'
        {
          userId: 2,
          serviceId: 8,
          rating: 3,
          description: ''
        },
      ];
      for (let i = 0; i < createdReviewIds.length; i++) {
        const id = createdReviewIds[i] * 1000000;
        const payload = payloads[i];
        const response = await request(app).put(`${path}/${id}`).set(validHeader).send(payload);
        expect(response.statusCode).toBe(404);
        expect(response.body.data).toStrictEqual({})
      }
    });
  });

  describe('given valid auth token and not found \'serviceId\'', () => {
    test('should respond with a 404 status code and return empty object data', async () => {
      const payloads = [
        // * valid 'userId'
        {
          userId: 1,
          serviceId: 1,
          rating: 5,
          description: 'test - so far so good'
        },
        {
          userId: 2,
          serviceId: 1,
          rating: 5,
          description: 'test - so far so good'
        },
        // * Valid 'serviceId'
        {
          userId: 1,
          serviceId: 3,
          rating: 5,
          description: 'test - so far so good'
        },
        {
          userId: 2,
          serviceId: 8,
          rating: 5,
          description: 'test - so far so good'
        },
        // * Valid 'rating'
        {
          userId: 2,
          serviceId: 8,
          rating: 1.2,
          description: 'test - so far so good'
        },
        {
          userId: 3,
          serviceId: 8,
          rating: 3,
          description: 'test - so far so good'
        },
        // * Valid 'description'
        {
          userId: 3,
          serviceId: 8,
          rating: 3,
          description: ''
        },
      ];
      for (let i = 0; i < createdReviewIds.length; i++) {
        const id = createdReviewIds[i];
        const payload = payloads[i];
        const { serviceId } = payload;
        payload.serviceId = serviceId * 1000000

        const response = await request(app).put(`${path}/${id}`).set(validHeader).send(payload);
        expect(response.statusCode).toBe(404);
        expect(response.body.data).toStrictEqual({});
      }
    });
  });

  describe('given valid auth token and invalid params', () => {
    test('should respond with a 400 status code and return empty object', async () => {
      const payloads = [
        // * invalid 'userId'
        {
          userId: -100,
          serviceId: 1,
          rating: 5,
          description: 'test - so far so good'
        },
        {
          userId: 2.90,
          serviceId: 1,
          rating: 5,
          description: 'test - so far so good'
        },
        {
          userId: '2we',
          serviceId: 1,
          rating: 5,
          description: 'test - so far so good'
        },
        // * invalid 'serviceId'
        {
          userId: 5,
          serviceId: -3,
          rating: 5,
          description: 'test - so far so good'
        },
        {
          userId: 2,
          serviceId: 8.5,
          rating: 5,
          description: 'test - so far so good'
        },
        {
          userId: 2,
          serviceId: '-55peh',
          rating: 5,
          description: 'test - so far so good'
        },
        // * invalid 'rating'
        {
          userId: 2,
          serviceId: 8,
          rating: -1.2,
          description: 'test - so far so good'
        },
        {
          userId: 3,
          serviceId: 8,
          rating: 5.01,
          description: 'test - so far so good'
        },
        {
          userId: 3,
          serviceId: 8,
          rating: '3q',
          description: 'test - so far so good'
        },
      ];
      for (let i = 0; i < createdReviewIds.length; i++) {
        const id = createdReviewIds[i];
        const payload = payloads[i];
        const response = await request(app).put(`${path}/${id}`).set(validHeader).send(payload);
        expect(response.statusCode).toBe(400);
      }
    })
  });

  describe('given invalid auth token and valid params', () => {
    test('should respond with a 401 status code and return empty object', async () => {
      const payloads = [
        // * valid 'userId'
        {
          userId: 1,
          serviceId: 1,
          rating: 5,
          description: 'test - so far so good'
        },
        {
          userId: 2,
          serviceId: 1,
          rating: 5,
          description: 'test - so far so good'
        },
        // * Valid 'serviceId'
        {
          userId: 5,
          serviceId: 3,
          rating: 5,
          description: 'test - so far so good'
        },
        {
          userId: 2,
          serviceId: 8,
          rating: 5,
          description: 'test - so far so good'
        },
        // * Valid 'rating'
        {
          userId: 2,
          serviceId: 8,
          rating: 1.2,
          description: 'test - so far so good'
        },
        {
          userId: 3,
          serviceId: 8,
          rating: 3,
          description: 'test - so far so good'
        },
        // * Valid 'description'
        {
          userId: 4,
          serviceId: 8,
          rating: 3,
          description: ''
        },
      ];
      for (let i = 0; i < createdReviewIds.length; i++) {
        const id = createdReviewIds[i];
        const payload = payloads[i];
        const response = await request(app).put(`${path}/${id}`).set(invalidHeader).send(payload);
        expect(response.statusCode).toBe(401);
        expect(response.body.data).toStrictEqual({});
      }
    });
  });

  describe('given invalid auth token and invalid params', () => {
    test('should respond with a 401 status code and return empty object', async () => {
      const payloads = [
        // * invalid 'userId'
        {
          userId: -100,
          serviceId: 1,
          rating: 5,
          description: 'test - so far so good'
        },
        {
          userId: 2.90,
          serviceId: 1,
          rating: 5,
          description: 'test - so far so good'
        },
        {
          userId: '2we',
          serviceId: 1,
          rating: 5,
          description: 'test - so far so good'
        },
        // * invalid 'serviceId'
        {
          userId: 5,
          serviceId: -3,
          rating: 5,
          description: 'test - so far so good'
        },
        {
          userId: 2,
          serviceId: 8.5,
          rating: 5,
          description: 'test - so far so good'
        },
        {
          userId: 2,
          serviceId: '-55peh',
          rating: 5,
          description: 'test - so far so good'
        },
        // * invalid 'rating'
        {
          userId: 2,
          serviceId: 8,
          rating: -1.2,
          description: 'test - so far so good'
        },
        {
          userId: 3,
          serviceId: 8,
          rating: 5.01,
          description: 'test - so far so good'
        },
        {
          userId: 3,
          serviceId: 8,
          rating: '3q',
          description: 'test - so far so good'
        },
      ];
      for (let i = 0; i < createdReviewIds.length; i++) {
        const id = createdReviewIds[i];
        const payload = payloads[i];
        const response = await request(app).put(`${path}/${id}`).set(invalidHeader).send(payload);
        expect(response.statusCode).toBe(401);
        expect(response.body.data).toStrictEqual({});
      }
    });
  });
});

describe('GET /api/v1/reviews/:id', () => {
  function generatePath(id) {
    return `/api/v1/reviews/${id}`;
  }

  describe('given valid token & valid params', () => {
    test('should respond with a 200 response and valid response', async () => {
      for (const id of createdReviewIds) {
        const path = generatePath(id);
        const response = await request(app).get(path).set(validHeader);
        expect(response.statusCode).toBe(200);
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data).toHaveProperty('serviceId');
        expect(response.body.data).toHaveProperty('userId');
        expect(response.body.data).toHaveProperty('description');
        expect(response.body.data).toHaveProperty('rating');
      }
    });
  });

  describe('given valid token & valid params but not found', () => {
    test('should respond with a 404 response and empty object', async () => {
      for (const id of createdReviewIds) {
        const path = generatePath(id * 10000);
        const response = await request(app).get(path).set(validHeader);
        expect(response.statusCode).toBe(404);
        expect(response.body.data).toStrictEqual({});
      }
    });
  });

  describe('given valid token & invalid params', () => {
    test('should respond with a 400 response and empty object', async () => {
      for (const id of createdReviewIds) {
        const path = generatePath(`${id}-abc`);
        const response = await request(app).get(path).set(validHeader);
        expect(response.statusCode).toBe(400);
        expect(response.body.data).toStrictEqual({});
      }
    });
  });

  describe('given invalid token & valid params', () => {
    test('should respond with a 401 response and valid response', async () => {
      for (const id of createdReviewIds) {
        const path = generatePath(id);
        const response = await request(app).get(path).set(invalidHeader);
        expect(response.statusCode).toBe(401);
        expect(response.body.data).toStrictEqual({});
      }
    });
  });

  describe('given invalid token & valid params but not found', () => {
    test('should respond with a 401 response and empty object', async () => {
      for (const id of createdReviewIds) {
        const path = generatePath(id * 10000);
        const response = await request(app).get(path).set(invalidHeader);
        expect(response.statusCode).toBe(401);
        expect(response.body.data).toStrictEqual({});
      }
    });
  });

  describe('given invalid token & invalid params', () => {
    test('should respond with a 400 response and empty object', async () => {
      for (const id of createdReviewIds) {
        const path = generatePath(`${id}-abc`);
        const response = await request(app).get(path).set(invalidHeader);
        expect(response.statusCode).toBe(401);
        expect(response.body.data).toStrictEqual({});
      }
    });
  });
});

describe('DELETE /api/v1/reviews/:id', () => {
  const path = '/api/v1/reviews';

  describe('given valid auth token and valid params', () => {
    test('should respond with a 200 status code and return empty object data', async () => {
      for (const id of createdReviewIds) {
        const response = await request(app).delete(`${path}/${id}`).set(validHeader);
        expect(response.statusCode).toBe(200);
      }
    });
  });

  describe('given valid auth token and not found \'id\'', () => {
    test('should respond with a 404 status code and return empty object data', async () => {
      for (const id of createdReviewIds) {
        const notFoundId = id * 10000
        const response = await request(app).delete(`${path}/${notFoundId}`).set(validHeader);
        expect(response.statusCode).toBe(404);
        expect(response.body.data).toStrictEqual({});
      }
    });
  });

  describe('given valid auth token and invalid params', () => {
    test('should respond with a 400 status code and return empty object data', async () => {
      for (const id of createdReviewIds) {
        const invalidId = `${id}-test`;
        const response = await request(app).delete(`${path}/${invalidId}`).set(validHeader);
        expect(response.statusCode).toBe(400);
        expect(response.body.data).toStrictEqual({});
      }
    });
  });

  describe('given invalid auth token and valid params', () => {
    test('should respond with a 401 status code and return empty object data', async () => {
      for (const id of createdReviewIds) {
        const response = await request(app).delete(`${path}/${id}`).set(invalidHeader);
        expect(response.statusCode).toBe(401);
        expect(response.body.data).toStrictEqual({});
      }
    });
  });

  describe('given invalid auth token and invalid params', () => {
    test('should respond with a 401 status code and return empty object data', async () => {
      for (const id of createdReviewIds) {
        const invalidId = `${id}-test`;
        const response = await request(app).delete(`${path}/${invalidId}`).set(invalidHeader);
        expect(response.statusCode).toBe(401);
        expect(response.body.data).toStrictEqual({});
      }
    });
  });
});

// * User Feature
describe('GET /api/v1/users/:id/reviews', () => {
  const path = '/api/v1/users';
  const postfix = 'reviews';

  describe('given valid auth token and valid params', () => {
    test('should respond with a 200 status code', async () => {
      const params = {
        page: 1,
        show: 10,
        sortBy: 'createdAt',
        sortingMethod: 'desc',
        keyword: 'test',
      }
      for (const id of userIdsWithReviews) {
        const response = await request(app).get(`${path}/${id}/${postfix}`).set(validHeader).query(params);
        expect(response.statusCode).toBe(200);
        expect(response.body.data.data).toHaveProperty('id');
        expect(response.body.data.data).toHaveProperty('username');
        expect(response.body.data.data).toHaveProperty('email');
        expect(response.body.data.data).toHaveProperty('reviews');
      }
    });
  });

  describe('given valid auth token and invalid params', () => {
    test('should respond with a 400 status code and return empty object', async () => {
      for (const id of userIdsWithReviews) {
        const invalidId = `${id}-test`;
        const response = await request(app).get(`${path}/${invalidId}/${postfix}`).set(validHeader);
        expect(response.statusCode).toBe(400);
        expect(response.body.data).toStrictEqual({});
      }
    });
  });

  describe('given invalid auth token and valid params', () => {
    test('should respond with a 401 status code', async () => {
      for (const id of userIdsWithReviews) {
        const response = await request(app).get(`${path}/${id}/${postfix}`).set(invalidHeader);
        expect(response.statusCode).toBe(401);
      }
    });
  });

  describe('given invalid auth token and invalid params', () => {
    test('should respond with a 401 status code', async () => {
      for (const id of userIdsWithReviews) {
        const invalidId = `${id}-test`;
        const response = await request(app).get(`${path}/${invalidId}/${postfix}`).set(invalidHeader);
        expect(response.statusCode).toBe(401);
      }
    });
  });
});

describe('GET /api/v1/users/:id', () => {
  function generatePath(id) {
    return `/api/v1/users/${id}`;
  }

  describe('given valid token & valid params', () => {
    test('should respond with a 200 response and valid response', async () => {
      for (const id of createdUserIds) {
        const path = generatePath(id);
        const response = await request(app).get(path).set(validHeader);
        expect(response.statusCode).toBe(200);
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data).toHaveProperty('username');
        expect(response.body.data).toHaveProperty('email');
        expect(response.body.data).toHaveProperty('role');
      }
    });
  });

  describe('given valid token & valid params but not found', () => {
    test('should respond with a 404 response and empty object', async () => {
      for (const id of createdUserIds) {
        const path = generatePath(id * 10000);
        const response = await request(app).get(path).set(validHeader);
        expect(response.statusCode).toBe(404);
        expect(response.body.data).toStrictEqual({});
      }
    });
  });

  describe('given valid token & invalid params', () => {
    test('should respond with a 400 response and empty object', async () => {
      for (const id of createdUserIds) {
        const path = generatePath(`${id}-abc`);
        const response = await request(app).get(path).set(validHeader);
        expect(response.statusCode).toBe(400);
        expect(response.body.data).toStrictEqual({});
      }
    });
  });

  describe('given invalid token & valid params', () => {
    test('should respond with a 401 response and valid response', async () => {
      for (const id of createdUserIds) {
        const path = generatePath(id);
        const response = await request(app).get(path).set(invalidHeader);
        expect(response.statusCode).toBe(401);
        expect(response.body.data).toStrictEqual({});
      }
    });
  });

  describe('given invalid token & valid params but not found', () => {
    test('should respond with a 401 response and empty object', async () => {
      for (const id of createdUserIds) {
        const path = generatePath(id * 10000);
        const response = await request(app).get(path).set(invalidHeader);
        expect(response.statusCode).toBe(401);
        expect(response.body.data).toStrictEqual({});
      }
    });
  });

  describe('given invalid token & invalid params', () => {
    test('should respond with a 400 response and empty object', async () => {
      for (const id of createdUserIds) {
        const path = generatePath(`${id}-abc`);
        const response = await request(app).get(path).set(invalidHeader);
        expect(response.statusCode).toBe(401);
        expect(response.body.data).toStrictEqual({});
      }
    });
  });
});

describe('PUT /api/v1/users/:id', () => {
  function generatePath(id) {
    return `/api/v1/users/${id}`;
  }

  describe('given valid admin token & valid params', () => {
    test('should respond with a 200 status code & valid response', async () => {
      const payloads = generateRandomUserPayloads();
      for (let idx = 0; idx < createdUserIds.length; idx++) {
        const id = createdUserIds[idx];
        const path = generatePath(id)
        const { username, email } = payloads[idx];
        const phoneNumber = idx < 3 ? '081232323223' : '';
        const payload = {
          username: `${username}-edited`,
          email: `edited-${email}`,
          phoneNumber
        }
        const response = await request(app).put(path).set(validHeader).send(payload);
        expect(response.statusCode).toBe(200);
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data).toHaveProperty('username');
        expect(response.body.data).toHaveProperty('email');
        expect(response.body.data).toHaveProperty('role');
      }
    });
  });

  describe('given valid admin token & valid params, but not found "id"', () => {
    test('should respond with a 404 status code & valid response', async () => {
      const payloads = generateRandomUserPayloads();
      for (let idx = 0; idx < createdUserIds.length; idx++) {
        const id = createdUserIds[idx];
        const path = generatePath(id * 10000)
        const { username, email } = payloads[idx];
        const phoneNumber = idx < 3 ? '081232323223' : '';
        const payload = {
          username: `${username}-edited`,
          email: `edited-${email}`,
          phoneNumber
        }
        const response = await request(app).put(path).set(validHeader).send(payload);
        expect(response.statusCode).toBe(404);
        expect(response.body.data).toStrictEqual({});
      }
    });
  });

  describe('given valid admin token & invalid params', () => {
    test('should respond with a 400 status code & valid response', async () => {
      const payloads = generateRandomUserPayloads();
      for (let idx = 0; idx < createdUserIds.length; idx++) {
        const id = createdUserIds[idx];
        const path = generatePath(id)
        const { username, email } = payloads[idx];
        const phoneNumber = idx < 3 ? '081232323223' : '';
        const usernameEdited = idx < 3 ? username : `${username}-edited`;
        const payload = {
          username: usernameEdited,
          email: `${email}-edited`,
          phoneNumber
        }
        const response = await request(app).put(path).set(validHeader).send(payload);
        expect(response.statusCode).toBe(400);
        expect(response.body.data).toStrictEqual({});
      }
    });
  });

  describe('given valid user token & valid params', () => {
    test('should respond with a 401 status code & valid response', async () => {
      const payloads = generateRandomUserPayloads();
      for (let idx = 0; idx < createdUserIds.length; idx++) {
        const id = createdUserIds[idx];
        const path = generatePath(id)
        const { username, email } = payloads[idx];
        const phoneNumber = idx < 3 ? '081232323223' : '';
        const payload = {
          username: `${username}-edited`,
          email: `edited-${email}`,
          phoneNumber
        }
        const response = await request(app).put(path).set(validUserHeader).send(payload);
        expect(response.statusCode).toBe(401);
        expect(response.body.data).toStrictEqual({});
      }
    });
  });

  describe('given valid user token & valid params, but not found "id"', () => {
    test('should respond with a 401 status code & valid response', async () => {
      const payloads = generateRandomUserPayloads();
      for (let idx = 0; idx < createdUserIds.length; idx++) {
        const id = createdUserIds[idx];
        const path = generatePath(id * 10000)
        const { username, email } = payloads[idx];
        const phoneNumber = idx < 3 ? '081232323223' : '';
        const payload = {
          username: `${username}-edited`,
          email: `edited-${email}`,
          phoneNumber
        }
        const response = await request(app).put(path).set(validUserHeader).send(payload);
        expect(response.statusCode).toBe(401);
        expect(response.body.data).toStrictEqual({});
      }
    });
  });

  describe('given valid user token & invalid params', () => {
    test('should respond with a 401 status code & valid response', async () => {
      const payloads = generateRandomUserPayloads();
      for (let idx = 0; idx < createdUserIds.length; idx++) {
        const id = createdUserIds[idx];
        const path = generatePath(id)
        const { username, email } = payloads[idx];
        const phoneNumber = idx < 3 ? '081232323223' : '';
        const usernameEdited = idx < 3 ? username : `${username}-edited`;
        const payload = {
          username: usernameEdited,
          email: `${email}-edited`,
          phoneNumber
        }
        const response = await request(app).put(path).set(validUserHeader).send(payload);
        expect(response.statusCode).toBe(401);
        expect(response.body.data).toStrictEqual({});
      }
    });
  });

  describe('given invalid token & valid params', () => {
    test('should respond with a 401 status code & valid response', async () => {
      const payloads = generateRandomUserPayloads();
      for (let idx = 0; idx < createdUserIds.length; idx++) {
        const id = createdUserIds[idx];
        const path = generatePath(id)
        const { username, email } = payloads[idx];
        const phoneNumber = idx < 3 ? '081232323223' : '';
        const payload = {
          username: `${username}-edited`,
          email: `edited-${email}`,
          phoneNumber
        }
        const response = await request(app).put(path).set(invalidHeader).send(payload);
        expect(response.statusCode).toBe(401);
        expect(response.body.data).toStrictEqual({});
      }
    });
  });

  describe('given invalid token & valid params, but not found "id"', () => {
    test('should respond with a 401 status code & valid response', async () => {
      const payloads = generateRandomUserPayloads();
      for (let idx = 0; idx < createdUserIds.length; idx++) {
        const id = createdUserIds[idx];
        const path = generatePath(id * 10000)
        const { username, email } = payloads[idx];
        const phoneNumber = idx < 3 ? '081232323223' : '';
        const payload = {
          username: `${username}-edited`,
          email: `edited-${email}`,
          phoneNumber
        }
        const response = await request(app).put(path).set(invalidHeader).send(payload);
        expect(response.statusCode).toBe(401);
        expect(response.body.data).toStrictEqual({});
      }
    });
  });

  describe('given invalid token & invalid params', () => {
    test('should respond with a 401 status code & valid response', async () => {
      const payloads = generateRandomUserPayloads();
      for (let idx = 0; idx < createdUserIds.length; idx++) {
        const id = createdUserIds[idx];
        const path = generatePath(id)
        const { username, email } = payloads[idx];
        const phoneNumber = idx < 3 ? '081232323223' : '';
        const usernameEdited = idx < 3 ? username : `${username}-edited`;
        const payload = {
          username: usernameEdited,
          email: `${email}-edited`,
          phoneNumber
        }
        const response = await request(app).put(path).set(invalidHeader).send(payload);
        expect(response.statusCode).toBe(401);
        expect(response.body.data).toStrictEqual({});
      }
    });
  });
});

describe('DELETE /api/v1/users/:id', () => {
  function generatePath(id) {
    return `/api/v1/users/${id}`;
  }

  describe('given valid admin token & valid params', () => {
    test('should respond with a 200 status code & valid response', async () => {
      for (const id of createdUserIds) {
        const path = generatePath(id);
        const response = await request(app).delete(path).set(validHeader);
        expect(response.statusCode).toBe(200);
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data).toHaveProperty('username');
        expect(response.body.data).toHaveProperty('email');
        expect(response.body.data).toHaveProperty('role');
      }
    });
  });

  describe('given valid admin token & valid params, but not found "id"', () => {
    test('should respond with a 404 status code & valid response', async () => {
      for (const id of createdUserIds) {
        const path = generatePath(id * 10000);
        const response = await request(app).delete(path).set(validHeader).send(payload);
        expect(response.statusCode).toBe(404);
        expect(response.body.data).toStrictEqual({});
      }
    });
  });

  describe('given valid admin token & invalid params', () => {
    test('should respond with a 400 status code & valid response', async () => {
      for (const id of createdUserIds) {
        const path = generatePath(`${id}-abc`);
        const response = await request(app).put(path).set(validHeader).send(payload);
        expect(response.statusCode).toBe(400);
        expect(response.body.data).toStrictEqual({});
      }
    });
  });
  
  describe('given valid user token & valid params', () => {
    test('should respond with a 401 status code & valid response', async () => {
      for (const id of createdUserIds) {
        const path = generatePath(id);
        const response = await request(app).delete(path).set(validUserHeader);
        expect(response.statusCode).toBe(401);
        expect(response.body.data).toStrictEqual({});
      }
    });
  });

  describe('given valid user token & valid params, but not found "id"', () => {
    test('should respond with a 401 status code & valid response', async () => {
      for (const id of createdUserIds) {
        const path = generatePath(id * 10000);
        const response = await request(app).delete(path).set(validUserHeader).send(payload);
        expect(response.statusCode).toBe(401);
        expect(response.body.data).toStrictEqual({});
      }
    });
  });

  describe('given valid user token & invalid params', () => {
    test('should respond with a 401 status code & valid response', async () => {
      for (const id of createdUserIds) {
        const path = generatePath(`${id}-abc`);
        const response = await request(app).put(path).set(validUserHeader).send(payload);
        expect(response.statusCode).toBe(401);
        expect(response.body.data).toStrictEqual({});
      }
    });
  });
  
  describe('given invalid token & valid params', () => {
    test('should respond with a 401 status code & valid response', async () => {
      for (const id of createdUserIds) {
        const path = generatePath(id);
        const response = await request(app).delete(path).set(invalidHeader);
        expect(response.statusCode).toBe(401);
        expect(response.body.data).toStrictEqual({});
      }
    });
  });

  describe('given invalid token & valid params, but not found "id"', () => {
    test('should respond with a 401 status code & valid response', async () => {
      for (const id of createdUserIds) {
        const path = generatePath(id * 10000);
        const response = await request(app).delete(path).set(invalidHeader).send(payload);
        expect(response.statusCode).toBe(401);
        expect(response.body.data).toStrictEqual({});
      }
    });
  });

  describe('given invalid token & invalid params', () => {
    test('should respond with a 401 status code & valid response', async () => {
      for (const id of createdUserIds) {
        const path = generatePath(`${id}-abc`);
        const response = await request(app).put(path).set(invalidHeader).send(payload);
        expect(response.statusCode).toBe(401);
        expect(response.body.data).toStrictEqual({});
      }
    });
  });
});

// * Service Type Feature
describe('POST /api/v1/service-types', () => {
  const path = '/api/v1/service-types';

  describe('given valid admin token & valid params', () => {
    test('should respond with a 201 status code & valid response', async () => {
      const payloads = generateRandomServiceTypePayloads();
      for (const payload of payloads) {
        const response = await request(app).post(path).set(validHeader).send(payload);
        expect(response.statusCode).toBe(201);
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data).toHaveProperty('name');

        createdServiceTypeIds.push(response.body.data.id);
        createdServiceTypePayloads.push(payload);
      }
    });
  });

  describe('given valid admin token & valid params, but already exists', () => {
    test('should respond with a 400 status code & valid response', async () => {;
      for (const payload of createdServiceTypePayloads) {
        const response = await request(app).post(path).set(validHeader).send(payload);
        expect(response.statusCode).toBe(400);
        expect(response.body.data).toStrictEqual({});
      }
    });
  });
  
  describe('given valid admin token & invalid params', () => {
    test('should respond with a 400 status code & empty data', async () => {
      const payloads = [
        { name: '' },
        {},
      ];
      for (const payload of payloads) {
        const response = await request(app).post(path).set(validHeader).send(payload);
        expect(response.statusCode).toBe(400);
        expect(response.body.data).toStrictEqual({});
      }
    })
  });

  describe('given valid user token & valid params', () => {
    test('should respond with a 401 status code & valid response', async () => {
      const payloads = generateRandomServiceTypePayloads();
      for (const payload of payloads) {
        const response = await request(app).post(path).set(validUserHeader).send(payload);
        expect(response.statusCode).toBe(401);
        expect(response.body.data).toStrictEqual({});
      }
    });
  });

  describe('given valid user token & valid params, but already exists', () => {
    test('should respond with a 401 status code & valid response', async () => {;
      for (const payload of createdServiceTypePayloads) {
        const response = await request(app).post(path).set(validUserHeader).send(payload);
        expect(response.statusCode).toBe(401);
        expect(response.body.data).toStrictEqual({});
      }
    });
  });
  
  describe('given valid user token & invalid params', () => {
    test('should respond with a 401 status code & empty data', async () => {
      const payloads = [
        { name: '' },
        {},
      ];
      for (const payload of payloads) {
        const response = await request(app).post(path).set(validUserHeader).send(payload);
        expect(response.statusCode).toBe(401);
        expect(response.body.data).toStrictEqual({});
      }
    })
  });

  describe('given invalid token & valid params', () => {
    test('should respond with a 401 status code & valid response', async () => {
      const payloads = generateRandomServiceTypePayloads();
      for (const payload of payloads) {
        const response = await request(app).post(path).set(invalidHeader).send(payload);
        expect(response.statusCode).toBe(401);
        expect(response.body.data).toStrictEqual({});
      }
    });
  });

  describe('given invalid token & valid params, but already exists', () => {
    test('should respond with a 401 status code & valid response', async () => {;
      for (const payload of createdServiceTypePayloads) {
        const response = await request(app).post(path).set(invalidHeader).send(payload);
        expect(response.statusCode).toBe(401);
        expect(response.body.data).toStrictEqual({});
      }
    });
  });
  
  describe('given invalid token & invalid params', () => {
    test('should respond with a 401 status code & empty data', async () => {
      const payloads = [
        { name: '' },
        {},
      ];
      for (const payload of payloads) {
        const response = await request(app).post(path).set(invalidHeader).send(payload);
        expect(response.statusCode).toBe(401);
        expect(response.body.data).toStrictEqual({});
      }
    })
  });
});

describe('GET /api/v1/service-types/select', () => {
  const path = '/api/v1/service-types/select';

  test('should respond with a 200 status code & valid response', async () => {
    const response = await request(app).get(path);
    expect(response.statusCode).toBe(200);
    expect(response.body.data[0]).toHaveProperty('id');
    expect(response.body.data[0]).toHaveProperty('name');
  })
});

describe('GET /api/v1/service-types/:id', () => {
  function generatePath(id) {
    return `/api/v1/service-types/${id}`;
  }

  describe('given valid admin token & valid params', () => {
    test('should respond with a 200 status code & valid response', async () => {
      for (const id of createdServiceTypeIds) {
        const path = generatePath(id);
        const response = await request(app).get(path).set(validHeader);
        expect(response.statusCode).toBe(200);
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data).toHaveProperty('name');
      }
    });
  });

  describe('given valid admin token & valid params, but not found "id"', () => {
    test('should respond with a 200 status code & valid response', async () => {
      for (const id of createdServiceTypeIds) {
        const path = generatePath(id * 1000000);
        const response = await request(app).get(path).set(validHeader);
        expect(response.statusCode).toBe(404);
        expect(response.body.data).toStrictEqual({});
      }
    });
  });

  describe('given valid admin token & invalid params', () => {
    test('should respond with a 200 status code & valid response', async () => {
      for (const id of createdServiceTypeIds) {
        const path = generatePath(`${id}-abc`);
        const response = await request(app).get(path).set(validHeader);
        expect(response.statusCode).toBe(400);
        expect(response.body.data).toStrictEqual({});
      }
    });
  });

  describe('given invalid token & valid params', () => {
    test('should respond with a 401 status code & valid response', async () => {
      for (const id of createdServiceTypeIds) {
        const path = generatePath(id);
        const response = await request(app).get(path).set(invalidHeader);
        expect(response.statusCode).toBe(401);
        expect(response.body.data).toStrictEqual({});
      }
    });
  });

  describe('given invalid token & valid params, but not found "id"', () => {
    test('should respond with a 401 status code & valid response', async () => {
      for (const id of createdServiceTypeIds) {
        const path = generatePath(id * 1000000);
        const response = await request(app).get(path).set(invalidHeader);
        expect(response.statusCode).toBe(401);
        expect(response.body.data).toStrictEqual({});
      }
    });
  });

  describe('given invalid token & invalid params', () => {
    test('should respond with a 401 status code & valid response', async () => {
      for (const id of createdServiceTypeIds) {
        const path = generatePath(`${id}-abc`);
        const response = await request(app).get(path).set(invalidHeader);
        expect(response.statusCode).toBe(401);
        expect(response.body.data).toStrictEqual({});
      }
    });
  });
});

describe('PUT /api/v1/service-types/:id', () => {
  function generatePath(id) {
    return `/api/v1/service-types/${id}`;
  }

  describe('given valid admin token & valid params', () => {
    test('should respond with a 200 status code & valid response', async () => {
      const payloads = generateRandomServiceTypePayloads();
      for (let i = 0; i < createdServiceTypeIds.length; i++) {
        const id = createdServiceTypeIds[i];
        const path = generatePath(id);
        const payload = payloads[i];
        const response = await request(app).put(path).set(validHeader).send(payload);
        expect(response.statusCode).toBe(200);
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data).toHaveProperty('name');
      }
    });
  });

  describe('given valid admin token & valid params, but not dounf "id"', () => {
    test('should respond with a 200 status code & valid response', async () => {
      const payloads = generateRandomServiceTypePayloads();
      for (let i = 0; i < createdServiceTypeIds.length; i++) {
        const id = createdServiceTypeIds[i];
        const path = generatePath(id * 100000);
        const payload = payloads[i];
        const response = await request(app).put(path).set(validHeader).send(payload);
        expect(response.statusCode).toBe(404);
        expect(response.body.data).toStrictEqual({});
      }
    });
  });

  describe('given valid admin token & valid params, but already exists', () => {
    test('should respond with a 400 status code & valid response', async () => {;
      for (let i = 0; i < createdServiceTypeIds; i++) {
        const id = createdServiceTypeIds[i];
        const path = generatePath(id);
        const payload = createdServiceTypePayloads[i];
        const response = await request(app).put(path).set(validHeader).send(payload);
        expect(response.statusCode).toBe(400);
        expect(response.body.data).toStrictEqual({});
      }
    });
  });
  
  describe('given valid admin token & invalid params', () => {
    test('should respond with a 400 status code & empty data', async () => {
      const payloads = [
        { name: '' },
        { name: '' },
        { name: '' },
        {},
        {},
      ];
      for (let i = 0; i < createdServiceTypeIds.length; i++) {
        const id = createdServiceTypeIds[i];
        const path = id < 3 ? generatePath(id) : generatePath(`${id}-abc`);
        const payload = payloads[i];
        const response = await request(app).put(path).set(validHeader).send(payload);
        expect(response.statusCode).toBe(400);
        expect(response.body.data).toStrictEqual({});
      }
    })
  });

  describe('given valid user token & valid params', () => {
    test('should respond with a 401 status code & valid response', async () => {
      const payloads = generateRandomServiceTypePayloads();
      for (let i = 0; i < createdServiceTypeIds.length; i++) {
        const id = createdServiceTypeIds[i];
        const path = generatePath(id);
        const payload = payloads[i];
        const response = await request(app).put(path).set(validUserHeader).send(payload);
        expect(response.statusCode).toBe(401);
        expect(response.body.data).toStrictEqual({});
      }
    });
  });

  describe('given valid user token & valid params, but already exists', () => {
    test('should respond with a 401 status code & valid response', async () => {;
      for (let i = 0; i < createdServiceTypeIds.length; i++) {
        const id = createdServiceTypeIds[i];
        const path = generatePath(id);
        const payload = createdServiceTypePayloads[i];
        const response = await request(app).put(path).set(validUserHeader).send(payload);
        expect(response.statusCode).toBe(401);
        expect(response.body.data).toStrictEqual({});
      }
    });
  });
  
  describe('given valid user token & invalid params', () => {
    test('should respond with a 401 status code & empty data', async () => {
      const payloads = [
        { name: '' },
        { name: '' },
        { name: '' },
        {},
        {},
      ];
      for (let i = 0; i < createdServiceTypeIds.length; i++) {
        const id = createdServiceTypeIds[i];
        const path = id < 3 ? generatePath(id) : generatePath(`${id}-abc`);
        const payload = payloads[i];
        const response = await request(app).put(path).set(validUserHeader).send(payload);
        expect(response.statusCode).toBe(401);
        expect(response.body.data).toStrictEqual({});
      }
    })
  });
  
  describe('given invalid token & valid params', () => {
    test('should respond with a 401 status code & valid response', async () => {
      const payloads = generateRandomServiceTypePayloads();
      for (let i = 0; i < createdServiceTypeIds.length; i++) {
        const id = createdServiceTypeIds[i];
        const path = generatePath(id);
        const payload = payloads[i];
        const response = await request(app).put(path).set(invalidHeader).send(payload);
        expect(response.statusCode).toBe(401);
        expect(response.body.data).toStrictEqual({});
      }
    });
  });

  describe('given invalid token & valid params, but already exists', () => {
    test('should respond with a 401 status code & valid response', async () => {;
      for (let i = 0; i < createdServiceTypeIds.length; i++) {
        const id = createdServiceTypeIds[i];
        const path = generatePath(id);
        const payload = createdServiceTypePayloads[i];
        const response = await request(app).put(path).set(invalidHeader).send(payload);
        expect(response.statusCode).toBe(401);
        expect(response.body.data).toStrictEqual({});
      }
    });
  });
  
  describe('given invalid token & invalid params', () => {
    test('should respond with a 401 status code & empty data', async () => {
      const payloads = [
        { name: '' },
        { name: '' },
        { name: '' },
        {},
        {},
      ];
      for (let i = 0; i < createdServiceTypeIds.length; i++) {
        const id = createdServiceTypeIds[i];
        const path = id < 3 ? generatePath(id) : generatePath(`${id}-abc`);
        const payload = payloads[i];
        const response = await request(app).put(path).set(invalidHeader).send(payload);
        expect(response.statusCode).toBe(401);
        expect(response.body.data).toStrictEqual({});
      }
    })
  });
});

describe('DELETE /api/v1/service-types/:id', () => {
  function generatePath(id) {
    return `/api/v1/service-types/${id}`;
  }

  describe('given valid admin token & valid params', () => {
    test('should respond with a 200 status code & valid response', async () => {
      for (const id of createdServiceTypeIds) {
        const path = generatePath(id);
        const response = await request(app).delete(path).set(validHeader);
        expect(response.statusCode).toBe(200);
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data).toHaveProperty('name');
      }
    });
  });

  describe('given valid admin token & valid params, but not found "id"', () => {
    test('should respond with a 404 status code & valid response', async () => {
      for (const id of createdServiceTypeIds) {
        const path = generatePath(id * 1000000);
        const response = await request(app).delete(path).set(validHeader);
        expect(response.statusCode).toBe(404);
        expect(response.body.data).toStrictEqual({});
      }
    });
  });

  describe('given valid admin token & invalid params', () => {
    test('should respond with a 400 status code & valid response', async () => {
      for (const id of createdServiceTypeIds) {
        const path = generatePath(`${id}-abc`);
        const response = await request(app).delete(path).set(validHeader);
        expect(response.statusCode).toBe(400);
        expect(response.body.data).toStrictEqual({});
      }
    });
  });

  describe('given valid user token & valid params', () => {
    test('should respond with a 401 status code & valid response', async () => {
      for (const id of createdServiceTypeIds) {
        const path = generatePath(id);
        const response = await request(app).delete(path).set(validUserHeader);
        expect(response.statusCode).toBe(401);
        expect(response.body.data).toStrictEqual({});
      }
    });
  });

  describe('given valid user token & valid params, but not found "id"', () => {
    test('should respond with a 401 status code & valid response', async () => {
      for (const id of createdServiceTypeIds) {
        const path = generatePath(id * 1000000);
        const response = await request(app).delete(path).set(validUserHeader);
        expect(response.statusCode).toBe(401);
        expect(response.body.data).toStrictEqual({});
      }
    });
  });

  describe('given valid user token & invalid params', () => {
    test('should respond with a 401 status code & valid response', async () => {
      for (const id of createdServiceTypeIds) {
        const path = generatePath(`${id}-abc`);
        const response = await request(app).delete(path).set(validUserHeader);
        expect(response.statusCode).toBe(401);
        expect(response.body.data).toStrictEqual({});
      }
    });
  });

  describe('given invalid token & valid params', () => {
    test('should respond with a 401 status code & valid response', async () => {
      for (const id of createdServiceTypeIds) {
        const path = generatePath(id);
        const response = await request(app).delete(path).set(invalidHeader);
        expect(response.statusCode).toBe(401);
        expect(response.body.data).toStrictEqual({});
      }
    });
  });

  describe('given invalid token & valid params, but not found "id"', () => {
    test('should respond with a 401 status code & valid response', async () => {
      for (const id of createdServiceTypeIds) {
        const path = generatePath(id * 1000000);
        const response = await request(app).delete(path).set(invalidHeader);
        expect(response.statusCode).toBe(401);
        expect(response.body.data).toStrictEqual({});
      }
    });
  });

  describe('given invalid token & invalid params', () => {
    test('should respond with a 401 status code & valid response', async () => {
      for (const id of createdServiceTypeIds) {
        const path = generatePath(`${id}-abc`);
        const response = await request(app).delete(path).set(invalidHeader);
        expect(response.statusCode).toBe(401);
        expect(response.body.data).toStrictEqual({});
      }
    });
  });
});