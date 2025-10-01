import {
  BaseCoordinatesConverter,
  REVOLUTION_INPUT_TYPE,
} from '../../src/converters/base_coordinates_converter';

const input1degree = 90;
const input1hour = 6;
const result1basicNumber: number[] = [52, 48, 48, 48]; // 4000
const result1preciseNumber: number[] = [52, 48, 48, 48, 48, 48, 48, 48]; // 40000000

const input2degreePrecise = '55555555';
const input2degreeBasic = '5555';
const input2hourPrecise = 'C0000000';
const input2hourBasic = 'C000';
const result2basicDegree = 120;
const result2basicHour = 18;
const result2preciseDegree = 120;
const result2preciseHour = 18;

describe('BaseCoordinatesConverter', () => {
  describe('#toPercentageOfRevolutionInHex', () => {
    test('for val1 basic degree', async () => {
      expect(
        BaseCoordinatesConverter.toPercentageOfRevolutionInHex(
          input1degree,
          REVOLUTION_INPUT_TYPE.Degree,
          false,
        ),
      ).toEqual(result1basicNumber);
    });
    test('for val1 basic hour', async () => {
      expect(
        BaseCoordinatesConverter.toPercentageOfRevolutionInHex(
          input1hour,
          REVOLUTION_INPUT_TYPE.Hour,
          false,
        ),
      ).toEqual(result1basicNumber);
    });
    test('for val1 precise degree', async () => {
      expect(
        BaseCoordinatesConverter.toPercentageOfRevolutionInHex(
          input1degree,
          REVOLUTION_INPUT_TYPE.Degree,
          true,
        ),
      ).toEqual(result1preciseNumber);
    });
    test('for val1 precise hour', async () => {
      expect(
        BaseCoordinatesConverter.toPercentageOfRevolutionInHex(
          input1hour,
          REVOLUTION_INPUT_TYPE.Hour,
          true,
        ),
      ).toEqual(result1preciseNumber);
    });
  });

  describe('#fromPercentageOfRevolutionInHex', () => {
    test('for val1 basic degree', async () => {
      expect(
        Math.round(
          BaseCoordinatesConverter.fromPercentageOfRevolutionInHex(
            input2degreeBasic,
            REVOLUTION_INPUT_TYPE.Degree,
            false,
          ),
        ),
      ).toEqual(result2basicDegree);
    });
    test('for val1 basic hour', async () => {
      expect(
        BaseCoordinatesConverter.fromPercentageOfRevolutionInHex(
          input2hourBasic,
          REVOLUTION_INPUT_TYPE.Hour,
          false,
        ),
      ).toEqual(result2basicHour);
    });
    test('for val1 precise degree', async () => {
      expect(
        Math.round(
          BaseCoordinatesConverter.fromPercentageOfRevolutionInHex(
            input2degreePrecise,
            REVOLUTION_INPUT_TYPE.Degree,
            true,
          ),
        ),
      ).toEqual(result2preciseDegree);
    });
    test('for val1 precise hour', async () => {
      expect(
        BaseCoordinatesConverter.fromPercentageOfRevolutionInHex(
          input2hourPrecise,
          REVOLUTION_INPUT_TYPE.Hour,
          true,
        ),
      ).toEqual(result2preciseHour);
    });
  });
});
