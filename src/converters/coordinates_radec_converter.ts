import { isVector3, type RaDec, type Vector3 } from '../types/coordinates.ts';
import { type StellariumView } from '../types/stellarium.ts';
import { BaseCoordinatesConverter, REVOLUTION_INPUT_TYPE } from './base_coordinates_converter.ts';
import { asciiArrayToString } from '../shared_helpers.ts';
import { logger } from '../logger.ts';

export class CoordinatesRaDecConverter extends BaseCoordinatesConverter {
  private readonly raDec: RaDec = { raHours: 0, decDeg: 0 };

  constructor(coords: Vector3 | RaDec) {
    let v: Vector3;
    let rd: RaDec;
    if (isVector3(coords)) {
      v = coords;
      rd = CoordinatesRaDecConverter.j2000VectorToRaDec(coords);
    } else {
      v = CoordinatesRaDecConverter.raDecToJ2000Vector(coords);
      rd = coords;
    }
    super(v);
    this.raDec = rd;
    logger.debug(JSON.stringify(rd));
  }

  public static fromApiSender(coordinates: StellariumView): CoordinatesRaDecConverter {
    return new CoordinatesRaDecConverter(coordinates.j2000);
  }

  public static fromNexstar(value: number[], highPrecision: boolean): CoordinatesRaDecConverter {
    const coordsHexString: string[] = asciiArrayToString(value).substring(1).split(',');
    if (coordsHexString.length !== 2) {
      throw new Error(`Invalid array size for: ${coordsHexString}`);
    }
    const radec: RaDec = {
      raHours: CoordinatesRaDecConverter.fromPercentageOfRevolutionInHex(
        coordsHexString[0]!,
        REVOLUTION_INPUT_TYPE.Hour,
        highPrecision,
      ),
      decDeg: CoordinatesRaDecConverter.fromPercentageOfRevolutionInHex(
        coordsHexString[1]!,
        REVOLUTION_INPUT_TYPE.Degree,
        highPrecision,
      ),
    };
    return new CoordinatesRaDecConverter(radec);
  }

  public asBasicNexstarRaDec(): number[] {
    const ra: number[] = CoordinatesRaDecConverter.toPercentageOfRevolutionInHex(
      this.raDec.raHours,
      REVOLUTION_INPUT_TYPE.Hour,
      false,
    );
    const dec: number[] = CoordinatesRaDecConverter.toPercentageOfRevolutionInHex(
      this.raDec.decDeg,
      REVOLUTION_INPUT_TYPE.Degree,
      false,
    );
    return ra.concat(CoordinatesRaDecConverter.SEPARATOR).concat(dec);
  }

  public asPreciseNexstarRaDec(): number[] {
    const ra: number[] = CoordinatesRaDecConverter.toPercentageOfRevolutionInHex(
      this.raDec.raHours,
      REVOLUTION_INPUT_TYPE.Hour,
      true,
    );
    const dec: number[] = CoordinatesRaDecConverter.toPercentageOfRevolutionInHex(
      this.raDec.decDeg,
      REVOLUTION_INPUT_TYPE.Degree,
      true,
    );
    return ra.concat(CoordinatesRaDecConverter.SEPARATOR).concat(dec);
  }

  public asRaDec(): RaDec {
    return this.raDec;
  }

  public override asVector3(): Vector3 {
    return this.baseVector;
  }

  // ===================================================================================================================

  private static j2000VectorToRaDec(v: Vector3): RaDec {
    const [x, y, z] = v;
    let raRad: number = Math.atan2(y, x);
    if (raRad < 0) {
      raRad += 2 * Math.PI;
    }
    const decRad: number = Math.asin(z);
    const raHours: number = (raRad * 12) / Math.PI;
    const decDeg: number = (decRad * 180) / Math.PI;
    return {
      raHours: raHours,
      decDeg: decDeg,
    };
  }

  private static raDecToJ2000Vector(radec: RaDec): Vector3 {
    const raRad: number = (radec.raHours * Math.PI) / 12;
    const decRad: number = (radec.decDeg * Math.PI) / 180;
    return [
      Math.cos(decRad) * Math.cos(raRad),
      Math.cos(decRad) * Math.sin(raRad),
      Math.sin(decRad),
    ];
  }
}
