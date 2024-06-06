require('dotenv').config();
const crypto = require('node:crypto');

function generateRandomUserPayloads(length = 5) {
  const payloads = [];
  const salt = Number(process.env.SALT);
  for (let i = 0; i < length; i++) {
    const randomAlphaNum = crypto.randomBytes(salt).toString('hex');
    const payload = {
      username: `test-${randomAlphaNum}`,
      password: randomAlphaNum,
      email: `test-${randomAlphaNum}@mail.com`,
    }
    payloads.push(payload);
  }
  return payloads;
}

function generateRandomServiceTypePayloads(length = 5) {
  const payloads = [];
  const salt = Number(process.env.SALT);
  for (let i = 0; i < length; i++) {
    const randomAlphaNum = crypto.randomBytes(salt).toString('hex');
    const payload = {
      name: `[TEST] Service No ${randomAlphaNum}`,
    }
    payloads.push(payload);
  }
  return payloads;
}

module.exports = {
  generateRandomUserPayloads,
  generateRandomServiceTypePayloads,
}