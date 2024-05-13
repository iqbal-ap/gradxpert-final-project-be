const { responseError, responseSuccess } = require('../helper/output');
const { STATUS_CODES, STATUS_TEXT } = require('../helper/httpStatusCodes');
const { BAD_REQUEST, INTERNAL_SERVER_ERROR } = require('../helper/error');

const mockResponse = {
  statusCode: 200,
  body: {
    data: {},
  },
  json: jest.fn((data) => {
    if (!data.data && !data?.code) {
      data.data = {};
      delete data.code;
      mockResponse.body.data = data;
    } else {
      mockResponse.body.data = data;
    }
    return mockResponse;
  }),
  status: jest.fn((code) => {
    if (code) mockResponse.statusCode = code;
    if (!code) mockResponse.statusCode = 400;
    return mockResponse;
  }),
};

const successPayloads = [
  {
    code: STATUS_CODES.OK,
    message: STATUS_TEXT[STATUS_CODES.OK],
    data: {},
  },
  {
    code: STATUS_CODES.Created,
    message: STATUS_TEXT[STATUS_CODES.Created],
    data: {},
  }
];
const errorPayloads = [
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
];

describe('Send success response', () => {
  test('should send response with a success status', () => {
    for (const payload of successPayloads) {
      const testResponse = responseSuccess(mockResponse, payload);
      expect(testResponse.body.data.status).toStrictEqual('Success');
    }
  });
  test('should send response with a respective status code', () => {
    for (const payload of successPayloads) {
      const testResponse = responseSuccess(mockResponse, payload);
      expect(testResponse.statusCode).toBe(payload.code);
    }
  });
  test('should send payload response', () => {
    for (const payload of successPayloads) {
      const testResponse = responseSuccess(mockResponse, payload);
      const { status, ...data } = testResponse.body.data;
      expect(data).toStrictEqual(payload);
    }
  });
})

describe('Send error response', () => {
  test('should send response with an error status', () => {
    for (const payload of errorPayloads) {
      const testResponse = responseError(mockResponse, payload);
      expect(testResponse.body.data.status).toStrictEqual('Error');
    }
  });
  test('should send response with a respective status code', () => {
    for (const payload of errorPayloads) {
      const testResponse = responseError(mockResponse, payload);
      expect(testResponse.statusCode).toBe(payload.code);
    }
  });
  test('should send empty payload data', async () => {
    for (const payload of errorPayloads) {
      const testResponse = responseError(mockResponse, payload);
      const { data } = testResponse.body.data;
      expect(data).toStrictEqual({});
    }
  });
  test('should send error response even without payload code', () => {
    const payload = {
      message: "'email' is not allowed to be empty",
    };
    const testResponse = responseError(mockResponse, payload)
    expect(testResponse.statusCode).toBe(400);
    expect(testResponse.body.data).toStrictEqual({
      status: 'Error',
      message: payload.message,
      data: {},
    });
  })
})