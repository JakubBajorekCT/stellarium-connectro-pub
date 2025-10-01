import { SlewConverter } from '../../src/converters/slew_converter';
import type { Vector3 } from '../../src/types/coordinates.ts';
import { roundArrayToPrecision } from '../../src/shared_helpers.ts';

describe('SlewConverter', () => {
  const slew1Converter: SlewConverter = SlewConverter.fromNexstar(2, 88);
  const v1: Vector3 = [-0.106491, -0.970237, 0.217486];
  const v1slewedAzmRaPositive: Vector3 = [-0.107214, -0.970157, 0.217486];
  const v1slewedAzmRaNegative: Vector3 = [-0.105768, -0.970316, 0.217486];
  const v1slewedAltDecPositive: Vector3 = [-0.106474, -0.970079, 0.218196];
  const v1slewedAltDecNegative: Vector3 = [-0.106508, -0.970394, 0.216776];

  const slew2Converter: SlewConverter = SlewConverter.fromStaticRate(0.041666667);

  describe('#moveVectorBySlew', () => {
    test('for test data 1 AzmRa Positive', async () => {
      const converted1: Vector3 = slew1Converter.moveVectorBySlew(
        v1,
        SlewConverter.SLEW_DIRECTION.AzmRaPositive,
      );
      const converted2: Vector3 = slew2Converter.moveVectorBySlew(
        v1,
        SlewConverter.SLEW_DIRECTION.AzmRaPositive,
      );
      expect(roundArrayToPrecision(converted1, 6)).toEqual(v1slewedAzmRaPositive);
      expect(roundArrayToPrecision(converted2, 6)).toEqual(v1slewedAzmRaPositive);
    });
    test('for test data 1 AzmRa Negative', async () => {
      const converted1: Vector3 = slew1Converter.moveVectorBySlew(
        v1,
        SlewConverter.SLEW_DIRECTION.AzmRaNegative,
      );
      const converted2: Vector3 = slew2Converter.moveVectorBySlew(
        v1,
        SlewConverter.SLEW_DIRECTION.AzmRaNegative,
      );
      expect(roundArrayToPrecision(converted1, 6)).toEqual(v1slewedAzmRaNegative);
      expect(roundArrayToPrecision(converted2, 6)).toEqual(v1slewedAzmRaNegative);
    });
    test('for test data 1 AltDec Positive', async () => {
      const converted1: Vector3 = slew1Converter.moveVectorBySlew(
        v1,
        SlewConverter.SLEW_DIRECTION.AltDecPositive,
      );
      const converted2: Vector3 = slew2Converter.moveVectorBySlew(
        v1,
        SlewConverter.SLEW_DIRECTION.AltDecPositive,
      );
      expect(roundArrayToPrecision(converted1, 6)).toEqual(v1slewedAltDecPositive);
      expect(roundArrayToPrecision(converted2, 6)).toEqual(v1slewedAltDecPositive);
    });
    test('for test data 1 AltDec Negative', async () => {
      const converted1: Vector3 = slew1Converter.moveVectorBySlew(
        v1,
        SlewConverter.SLEW_DIRECTION.AltDecNegative,
      );
      const converted2: Vector3 = slew2Converter.moveVectorBySlew(
        v1,
        SlewConverter.SLEW_DIRECTION.AltDecNegative,
      );
      expect(roundArrayToPrecision(converted1, 6)).toEqual(v1slewedAltDecNegative);
      expect(roundArrayToPrecision(converted2, 6)).toEqual(v1slewedAltDecNegative);
    });
  });
});
