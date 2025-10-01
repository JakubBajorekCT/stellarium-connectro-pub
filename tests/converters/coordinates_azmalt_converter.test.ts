import { CoordinatesAzmAltConverter } from '../../src/converters/coordinates_azmalt_converter';

import { azmalt } from '../test_data/azmalt';

describe('CoordinatesAzmAltConverter', () => {
  const coords1: CoordinatesAzmAltConverter = CoordinatesAzmAltConverter.fromApiSender(
    azmalt.c1.api,
  );
  const coords2: CoordinatesAzmAltConverter = CoordinatesAzmAltConverter.fromApiSender(
    azmalt.c2.api,
  );
  const coords3: CoordinatesAzmAltConverter = CoordinatesAzmAltConverter.fromApiSender(
    azmalt.c3.api,
  );

  describe('#asVector3', () => {
    test('for apiCoords1', async () => {
      expect(coords1.asVector3()).toEqual(azmalt.c1.v3);
    });
    test('for apiCoords2', async () => {
      expect(coords2.asVector3()).toEqual(azmalt.c2.v3);
    });
    test('for apiCoords3', async () => {
      expect(coords3.asVector3()).toEqual(azmalt.c3.v3);
    });
  });

  describe('#asAzmAlt', () => {
    test('for apiCoords1', async () => {
      expect(coords1.asAzmAlt()).toEqual(azmalt.c1.azmalt);
    });
    test('for apiCoords2', async () => {
      expect(coords2.asAzmAlt()).toEqual(azmalt.c2.azmalt);
    });
    test('for apiCoords3', async () => {
      expect(coords3.asAzmAlt()).toEqual(azmalt.c3.azmalt);
    });
  });

  describe('#asBasicNexstarAzmAlt', () => {
    test('for apiCoords1', async () => {
      expect(coords1.asBasicNexstarAzmAlt()).toEqual(azmalt.c1.basicNumber);
    });
    test('for apiCoords2', async () => {
      expect(coords2.asBasicNexstarAzmAlt()).toEqual(azmalt.c2.basicNumber);
    });
    test('for apiCoords3', async () => {
      expect(coords3.asBasicNexstarAzmAlt()).toEqual(azmalt.c3.basicNumber);
    });
  });

  describe('#asPreciseNexstarAmzAlt', () => {
    test('for apiCoords1', async () => {
      expect(coords1.asPreciseNexstarAmzAlt()).toEqual(azmalt.c1.preciseNumber);
    });
    test('for apiCoords2', async () => {
      expect(coords2.asPreciseNexstarAmzAlt()).toEqual(azmalt.c2.preciseNumber);
    });
    test('for apiCoords3', async () => {
      expect(coords3.asPreciseNexstarAmzAlt()).toEqual(azmalt.c3.preciseNumber);
    });
  });
});
