const request = require('supertest');
const app = require('../app');

// TODO: Add dependency injection to app
// TODO: Mock models function

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
  this.path = '/api/v1/login';

  //* given a valid username, email, and password
  // describe('given a valid username, email, and password', () => {
  // TODO: should respond with a 200 status code
  //   test('should respond with a 200 status code', async () => {
  //     const response = await request(app).post('/api/v1/login').send({
  //       username: 'username',
  //       password: 'password',
  //       email: 'some.user@gmail.com',
  //     });
  //     console.log('response:', response)
  //     expect(response.statusCode).toBe(200);
  //   })
  // TODO: should respond with id, username, email, role, and token 
  // })

  // TODO: given a valid username/email and password
  // TODO: should respond with a 200 status code
  // TODO: should respond with id, username, email, role, and token

  // TODO: given an unrecognized user data (username/email & password)
  // TODO: should respond with a 404 status code
  // TODO: should respond with empty object data

  // TODO: given an unmatch username/email and password
  // TODO: should respond with a 400 status code
  // TODO: should respond with empty object data

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
        const response = await request(app).post(this.path).send(payload);
        expect(response.statusCode).toBe(400);
        expect(response.body.data).toStrictEqual({});
      }
    })
  });
});

describe('POST /api/v1/register', () => {
  this.path = '/api/v1/register';

  describe('given an invalid payloads', () => {
    // TODO: should respond with a 400 status code & empty object data
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
        const response = await request(app).post(this.path).send(payload);
        expect(response.statusCode).toBe(400);
        expect(response.body.data).toStrictEqual({});
      }
    })
  });
})