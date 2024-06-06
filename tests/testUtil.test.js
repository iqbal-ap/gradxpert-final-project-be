const {
  generateRandomUserPayloads,
  generateRandomServiceTypePayloads,
 } = require('../helper/testUtil');

describe('when function "generateRandomUserPayloads" is called', () => {
  test('should return unique value', () => {
    const generatedPayloads = generateRandomUserPayloads(10);
    for (const payload of generatedPayloads) {
      const payloadFound = generatedPayloads.filter((item) => item.password === payload.password);
      const payloadFoundLength = payloadFound.length;
      
      expect(payloadFound).toBeTruthy();
      expect(payloadFound).not.toBeFalsy();
      expect(payloadFoundLength).toBe(1);
    }
  })
})

describe('when function "generateRandomServiceTypePayloads" is called', () => {
  test('should return unique value', () => {
    const generatedPayloads = generateRandomServiceTypePayloads(10);
    for (const payload of generatedPayloads) {
      const payloadFound = generatedPayloads.filter((item) => item.name === payload.name);
      const payloadFoundLength = payloadFound.length;
      
      expect(payloadFound).toBeTruthy();
      expect(payloadFound).not.toBeFalsy();
      expect(payloadFoundLength).toBe(1);
    }
  })
})