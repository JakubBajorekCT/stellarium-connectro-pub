import { type AzmAlt, isVector3, type Vector3 } from '../types/coordinates.ts';
import { type StellariumView } from '../types/stellarium.ts';
import { BaseCoordinatesConverter, REVOLUTION_INPUT_TYPE } from './base_coordinates_converter.ts';
import { asciiArrayToString } from '../shared_helpers.ts';

export class CoordinatesAzmAltConverter extends BaseCoordinatesConverter {
  private readonly azmAlt: AzmAlt = { azimuth: 0, altitude: 0 };

  constructor(coords: Vector3 | AzmAlt) {
    let v: Vector3;
    let aa: AzmAlt;
    if (isVector3(coords)) {
      v = coords;
      aa = CoordinatesAzmAltConverter.vectorToAzmAlt(coords);
    } else {
      v = CoordinatesAzmAltConverter.azmAltToVector(coords);
      aa = coords;
    }
    super(v);
    this.azmAlt = aa;
  }

  public static fromApiSender(coordinates: StellariumView): CoordinatesAzmAltConverter {
    return new CoordinatesAzmAltConverter(coordinates.altAz);
  }

  public static fromNexstar(value: number[], highPrecision: boolean): CoordinatesAzmAltConverter {
    const coordsHexString: string[] = asciiArrayToString(value).substring(1).split(',');
    if (coordsHexString.length !== 2) {
      throw new Error(`Invalid array size for: ${coordsHexString}`);
    }
    const azmAlt: AzmAlt = {
      azimuth: CoordinatesAzmAltConverter.fromPercentageOfRevolutionInHex(
        coordsHexString[0]!,
        REVOLUTION_INPUT_TYPE.Degree,
        highPrecision,
      ),
      altitude: CoordinatesAzmAltConverter.fromPercentageOfRevolutionInHex(
        coordsHexString[1]!,
        REVOLUTION_INPUT_TYPE.Degree,
        highPrecision,
      ),
    };
    return new CoordinatesAzmAltConverter(azmAlt);
  }

  public asBasicNexstarAzmAlt(): number[] {
    const azm: number[] = CoordinatesAzmAltConverter.toPercentageOfRevolutionInHex(
      this.azmAlt.azimuth,
      REVOLUTION_INPUT_TYPE.Degree,
      false,
    );
    const alt: number[] = CoordinatesAzmAltConverter.toPercentageOfRevolutionInHex(
      this.azmAlt.altitude,
      REVOLUTION_INPUT_TYPE.Degree,
      false,
    );
    return azm.concat(CoordinatesAzmAltConverter.SEPARATOR).concat(alt);
  }

  public asPreciseNexstarAmzAlt(): number[] {
    const azm: number[] = CoordinatesAzmAltConverter.toPercentageOfRevolutionInHex(
      this.azmAlt.azimuth,
      REVOLUTION_INPUT_TYPE.Degree,
      true,
    );
    const alt: number[] = CoordinatesAzmAltConverter.toPercentageOfRevolutionInHex(
      this.azmAlt.altitude,
      REVOLUTION_INPUT_TYPE.Degree,
      true,
    );
    return azm.concat(CoordinatesAzmAltConverter.SEPARATOR).concat(alt);
  }

  public asAzmAlt(): AzmAlt {
    return this.azmAlt;
  }

  // ===================================================================================================================

  private static vectorToAzmAlt(v: Vector3): AzmAlt {
    const [x, y, z] = v;
    const alt: number = (Math.asin(z) * 180) / Math.PI;
    let azPrime: number = (Math.atan2(y, x) * 180) / Math.PI;
    if (azPrime < 0) {
      azPrime += 360;
    }
    let az: number = 180 - azPrime;
    if (az < 0) {
      az += 360;
    }
    return { altitude: alt, azimuth: az };
  }

  private static azmAltToVector(aa: AzmAlt): Vector3 {
    const altRad: number = (aa.altitude * Math.PI) / 180;
    const azRad: number = ((180 - aa.azimuth) * Math.PI) / 180;
    const z: number = Math.sin(altRad);
    const cosAlt: number = Math.cos(altRad);
    const x: number = Math.cos(azRad) * cosAlt;
    const y: number = Math.sin(azRad) * cosAlt;
    return [x, y, z];
  }
}
