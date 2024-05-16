require('dotenv').config();
const request = require('supertest');
const { authenticateDb } = require('../helper/db');
const app = require('../app');
const models  = require('../models/index');
const { generateRandomPayloads } = require('../helper/testUtil');

const tokenAdmin = process.env.ADMIN_TOKEN_1;
const createdReviewIds = [];
const userIdsWithReviews = [];

beforeAll(async () => {
  await authenticateDb(models.DbConnection);
});

afterAll(() => {
  console.log('createdReviewIds:', createdReviewIds);
  console.log('userIdsWithReviews:', userIdsWithReviews);
})

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
      const payloads = generateRandomPayloads();
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
    const payloads = generateRandomPayloads(); 

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
})

describe('GET /api/v1/services', () => {
  const path = '/api/v1/services';

  describe('given default & valid query params', () => {
    test('should respond with a 200 status code', async () => {
      const response = await request(app).get(path);
      expect(response.statusCode).toBe(200);
    });
    test('should respond with defined response\'s properties', async () => {
      const response = await request(app).get(path);
      expect(response.body.data[0]).toHaveProperty('id');
      expect(response.body.data[0]).toHaveProperty('name');
      expect(response.body.data[0]).toHaveProperty('description');
      expect(response.body.data[0]).toHaveProperty('rating');
      expect(response.body.data[0]).toHaveProperty('phoneNumber');
      expect(response.body.data[0]).toHaveProperty('createdAt');
      expect(response.body.data[0]).toHaveProperty('updatedAt');
      expect(response.body.data[0]).toHaveProperty('deletedAt');
      expect(response.body.data[0]).toHaveProperty('serviceTypeId');
      expect(response.body.data[0]).toHaveProperty('serviceType');
      expect(response.body.data[0]?.serviceType).toHaveProperty('id');
      expect(response.body.data[0]?.serviceType).toHaveProperty('name');
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
          keyword: 'vi'
        },
        {
          keyword: 'erv'
        },
        // * Custom all
        {
          page: 4,
          show: 1,
          sortBy: 'createdAt',
          sortingMethod: 'desc',
          keyword: 'rvic',
        },
      ];

      for (const params of customQueryParams) {
        const response = await request(app).get(path).query(params)
        expect(response.statusCode).toBe(200);
        expect(response.body.data[0]).toHaveProperty('id');
        expect(response.body.data[0]).toHaveProperty('name');
        expect(response.body.data[0]).toHaveProperty('description');
        expect(response.body.data[0]).toHaveProperty('rating');
        expect(response.body.data[0]).toHaveProperty('phoneNumber');
        expect(response.body.data[0]).toHaveProperty('createdAt');
        expect(response.body.data[0]).toHaveProperty('updatedAt');
        expect(response.body.data[0]).toHaveProperty('deletedAt');
        expect(response.body.data[0]).toHaveProperty('serviceTypeId');
        expect(response.body.data[0]).toHaveProperty('serviceType');
        expect(response.body.data[0]?.serviceType).toHaveProperty('id');
        expect(response.body.data[0]?.serviceType).toHaveProperty('name');
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

describe('GET /api/v1/services/:id', () => {
  const path = '/api/v1/services'
  describe('given valid id', () => {
    test('should respond with a 200 status code and return with valid params', async () => {
      for (let id = 1; id < 16; id ++) {
        const response = await request(app).get(`${path}/${id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data).toHaveProperty('name');
        expect(response.body.data).toHaveProperty('description');
        expect(response.body.data).toHaveProperty('rating');
        expect(response.body.data).toHaveProperty('address');
        expect(response.body.data).toHaveProperty('phoneNumber');
        expect(response.body.data).toHaveProperty('serviceTypeId');
        expect(response.body.data).toHaveProperty('serviceType');
        expect(response.body.data).toHaveProperty('reviews');
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
  
  describe('given valid but non exists value', () => {
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

describe('POST /api/v1/reviews', () => {
  const path = '/api/v1/reviews';
  const header = {
    Authorization: `Bearer ${tokenAdmin}`,
    'Content-Type': 'application/json',
  };

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
        const response = await request(app).post(path).set(header).send(payload);
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

  // TODO: given valid auth token and invalid params
  // TODO: given invalid auth token and valid params
  // TODO: given invalid auth token and invalid params
});

describe('PUT /api/v1/reviews/:id', () => {
  const path = '/api/v1/reviews';
  const header = {
    Authorization: `Bearer ${tokenAdmin}`,
    'Content-Type': 'application/json',
  };

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
        const response = await request(app).put(`${path}/${id}`).set(header).send(payload);
        expect(response.statusCode).toBe(200);
        // expect(response.body.data).toStrictEqual({});

        userIdsWithReviews.push(response.body.data.userId);
      }
    });
  });
  // TODO: given valid auth token and invalid params
  // TODO: given invalid auth token and valid params
  // TODO: given invalid auth token and invalid params
});

describe('GET /api/v1/users/:id/reviews', () => {
  const path = '/api/v1/users';
  const postfix = 'reviews';
  const header = {
    Authorization: `Bearer ${tokenAdmin}`,
    'Content-Type': 'application/json',
  };
  
  describe('given valid auth token and valid params', () => {
    test('should respond with a 200 status code', async () => {
      for (const id of userIdsWithReviews) {
        const response = await request(app).get(`${path}/${id}/${postfix}`).set(header);
        expect(response.statusCode).toBe(200);
      }
    });
  });
  // TODO: given valid auth token and invalid params
  // TODO: given invalid auth token and valid params
  // TODO: given invalid auth token and invalid params
});

describe('DELETE /api/v1/reviews/:id', () => {
  const path = '/api/v1/reviews';
  const header = {
    Authorization: `Bearer ${tokenAdmin}`,
    'Content-Type': 'application/json',
  };
  
  describe('given valid auth token and valid params', () => {
    test('should respond with a 200 status code and return empty object data', async () => {
      for (const id of createdReviewIds) {
        const response = await request(app).delete(`${path}/${id}`).set(header);
        expect(response.statusCode).toBe(200);
        expect(response.body.data).toStrictEqual({});
      }
    });
  });

  // TODO: given valid auth token and invalid params
  // TODO: given invalid auth token and valid params
  // TODO: given invalid auth token and invalid params
});