const { generateRandomPayloads } = require('../helper/testUtil');

describe('when function is called', () => {
  test('should return unique value', () => {
    const generatedPayloads = generateRandomPayloads(10);
    for (const payload of generatedPayloads) {
      const payloadFound = generatedPayloads.filter((item) => item.password === payload.password);
      const payloadFoundLength = payloadFound.length;
      
      expect(payloadFound).toBeTruthy();
      expect(payloadFound).not.toBeFalsy();
      expect(payloadFoundLength).toBe(1);
    }
  })
})