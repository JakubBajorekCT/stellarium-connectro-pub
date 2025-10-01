import { isRaDec, isVector3 } from '../../src/types/coordinates.ts';

describe('types/coordinates', () => {
  describe('#isRaDec', () => {
    test('for non-radec object', () => {
      expect(isRaDec({})).toBe(false);
    });
    test('for radec object', () => {
      expect(isRaDec({ raHours: 1, decDeg: 4 })).toBe(true);
    });
  });
  describe('#isVector3', () => {
    test('for non-vector3 object', async () => {
      expect(isVector3({})).toBe(false);
    });
    test('for vector3 object', async () => {
      expect(isVector3([4, 5, 6])).toBe(true);
    });
  });
});
