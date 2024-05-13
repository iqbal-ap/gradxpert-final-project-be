require('dotenv').config();
const request = require('supertest');
const { authenticateDb } = require('../helper/db');
const app = require('../app');
const models  = require('../models/index');
const { generateRandomPayloads } = require('../helper/testUtil');

beforeAll(async () => {
  await authenticateDb(models.DbConnection);

  //  * GET Token Admin
  const admin = await request(app).post('/api/v1/login').send({
    username: process.env.ADMIN_USERNAME_1,
    password: process.env.ADMIN_PASSWORD_1,
    email: process.env.ADMIN_EMAIL_1,
  })
  const tokenAdmin = admin.body.data.token;
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
    // test('should respond with <some responses properties>')
  });
})

// TODO: given custom & valid query params
// TODO: should respond with a 200 status code
// TODO: should respond with <some response's properties> 

// TODO: given invalid query params
// TODO: should respond with a 200 status code & empty array 

// TODO: GET /services/:id
// TODO: given valid id
// TODO: should respond with a 200 status code
// TODO: should respond with <some response's properties>

// TODO: given invalid id
// TODO: should respond with a 404 status code
// TODO: should respond with <some response's properties>

// TODO: POST /reviews
// TODO: PUT /reviews/:id
// TODO: DELETE /reviews/:id