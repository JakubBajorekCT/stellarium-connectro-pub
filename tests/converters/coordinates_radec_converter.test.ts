import { CoordinatesRaDecConverter } from '../../src/converters/coordinates_radec_converter';
import { radec } from '../test_data/radec';

describe('CoordinatesRaDecConverter', () => {
  const coords1: CoordinatesRaDecConverter = CoordinatesRaDecConverter.fromApiSender(radec.c1.api);
  const coords2: CoordinatesRaDecConverter = CoordinatesRaDecConverter.fromApiSender(radec.c2.api);

  describe('#asVector3', () => {
    test('for apiCoords1', async () => {
      expect(coords1.asVector3()).toEqual(radec.c1.v3);
    });
    test('for apiCoords2', async () => {
      expect(coords2.asVector3()).toEqual(radec.c2.v3);
    });
  });

  describe('#asRaDec', () => {
    test('for apiCoords1', async () => {
      expect(coords1.asRaDec()).toEqual(radec.c1.radec);
    });
    test('for apiCoords2', async () => {
      expect(coords2.asRaDec()).toEqual(radec.c2.radec);
    });
  });

  describe('#asBasicNexstarRaDec', () => {
    test('for apiCoords1', async () => {
      expect(coords1.asBasicNexstarRaDec()).toEqual(radec.c1.basicNumber);
    });
    test('for apiCoords2', async () => {
      expect(coords2.asBasicNexstarRaDec()).toEqual(radec.c2.basicNumber);
    });
  });

  describe('#asPreciseNexstarRaDec', () => {
    test('for apiCoords1', async () => {
      expect(coords1.asPreciseNexstarRaDec()).toEqual(radec.c1.preciseNumber);
    });
    test('for apiCoords2', async () => {
      expect(coords2.asPreciseNexstarRaDec()).toEqual(radec.c2.preciseNumber);
    });
  });
});
