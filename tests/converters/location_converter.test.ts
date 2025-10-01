import { LocationConverter } from '../../src/converters/location_converter';
import { stringToAsciiArray, roundToPrecision } from '../../src/shared_helpers';

import { location } from '../test_data/location';

describe('LocationConverter', () => {
  const location1converter: LocationConverter = LocationConverter.fromApiSender(location.l1.api);
  const location2converter: LocationConverter = LocationConverter.fromNexstar(
    stringToAsciiArray(`W${location.l2.nexstarString}`),
  );

  describe('conversions', () => {
    test('for location1 nexstar format', async () => {
      expect(location1converter.asNexstar()).toEqual(location.l1.nexstarNumber);
    });
    test('for location1 dms format', async () => {
      expect(location1converter.asDms()).toEqual(location.l1.dms);
    });
    test('for location1 xyz format', async () => {
      expect(location1converter.asXyzRotationBytes()).toEqual(location.l1.xyzObj);
    });
    test('for location2 decimal format', async () => {
      const lat: number = roundToPrecision(location2converter.asDecimal().latitude, 3);
      const lon: number = roundToPrecision(location2converter.asDecimal().longitude, 3);
      expect(lat).toEqual(location.l2.decimal.latitude);
      expect(lon).toEqual(location.l2.decimal.longitude);
    });
    test('for location2 dms format', async () => {
      expect(location2converter.asDms()).toEqual(location.l2.dms);
    });
    test('for location2 xyz format', async () => {
      expect(location2converter.asXyzRotationBytes()).toEqual(location.l2.xyzObj);
    });
    test('for example data from xyz format to dec', async () => {
      expect(
        roundToPrecision(LocationConverter.xyzRotationToDecimal({ x: 244, y: 199, z: 100 }), 5),
      ).toEqual(344.22029);
      expect(
        roundToPrecision(LocationConverter.xyzRotationToDecimal({ x: 11, y: 56, z: 156 }), 5),
      ).toEqual(15.77971);
      expect(
        roundToPrecision(LocationConverter.xyzRotationToDecimal({ x: 211, y: 234, z: 169 }), 5),
      ).toEqual(298.00778);
    });
  });
});
