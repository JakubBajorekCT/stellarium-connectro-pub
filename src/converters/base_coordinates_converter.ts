import { type Vector3 } from '../types/coordinates.ts';
import { stringToAsciiArray } from '../shared_helpers.ts';

export const REVOLUTION_INPUT_TYPE = {
  Degree: 0,
  Hour: 1,
};

export class BaseCoordinatesConverter {
  protected static SEPARATOR: number[] = [44]; // ","
  protected baseVector: Vector3;

  constructor(v: Vector3) {
    this.baseVector = v;
  }

  public asVector3(): Vector3 {
    return this.baseVector;
  }

  public static fromPercentageOfRevolutionInHex(
    value: string,
    type: number,
    highPrecision: boolean,
  ): number {
    const bits: number = highPrecision ? 32 : 16;
    const scale: number = 2 ** bits;
    const valueDec: number = parseInt(value, 16);
    if (isNaN(valueDec)) {
      throw new Error(`Invalid hex string: ${value}`);
    }
    let outputMin: number;
    let outputMax: number;
    switch (type) {
      case REVOLUTION_INPUT_TYPE.Degree:
        outputMin = 0;
        outputMax = 360;
        break;
      case REVOLUTION_INPUT_TYPE.Hour:
        outputMin = 0;
        outputMax = 24;
        break;
      default:
        throw new Error(`Type: ${type} in fromPercentageOfRevolutionInHex not supported`);
    }
    const inputDiff: number = outputMax - outputMin;
    const valueNormalized: number = (valueDec / scale) * inputDiff;
    return outputMin + valueNormalized;
  }

  public static toPercentageOfRevolutionInHex(
    value: number,
    type: number,
    highPrecision: boolean,
  ): number[] {
    const bits: number = highPrecision ? 32 : 16;
    const digits: number = highPrecision ? 8 : 4;
    const scale: number = 2 ** bits;
    let normalizedValue: number;
    let inputDiff: number;
    switch (type) {
      case REVOLUTION_INPUT_TYPE.Degree:
        inputDiff = 360;
        normalizedValue = value - 360 * Math.floor(value / 360);
        if (normalizedValue < 0) {
          normalizedValue += 360;
        }
        break;
      case REVOLUTION_INPUT_TYPE.Hour:
        inputDiff = 24;
        normalizedValue = value - 24 * Math.floor(value / 24);
        break;
      default:
        throw new Error(`Type: ${type} in toPercentageOfRevolutionInHex not supported`);
    }
    const valueConverted: number = Math.round((normalizedValue / inputDiff) * scale);
    const rawHex: string = valueConverted.toString(16).toUpperCase().padStart(digits, '0');
    return stringToAsciiArray(rawHex);
  }
}
