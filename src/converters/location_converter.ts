import { type StellariumStatusLocation } from '../types/stellarium.ts';
import type {
  LocationDecimal,
  LocationDms,
  LocationDmsSingleAtr,
  LocationXyzRotationBytes,
  LocationXyz,
} from '../types/location.ts';

export class LocationConverter {
  locationDec: LocationDecimal;
  locationDms: LocationDms;

  constructor(latitude: number, longitude: number) {
    this.locationDec = { latitude, longitude };
    this.locationDms = {
      latitude: LocationConverter.decimalToDms(latitude),
      longitude: LocationConverter.decimalToDms(longitude),
    };
  }

  public static fromApiSender(apiSenderLocation: StellariumStatusLocation): LocationConverter {
    return new LocationConverter(apiSenderLocation.latitude, apiSenderLocation.longitude);
  }

  public static fromNexstar(nexstarLocation: number[]): LocationConverter {
    const trimmedNexstarLocation: number[] = nexstarLocation.slice(1);
    const loc: LocationDecimal = LocationConverter.nexstarToDecimal(trimmedNexstarLocation);
    return new LocationConverter(loc.latitude, loc.longitude);
  }

  public asNexstar(): number[] {
    return [
      this.locationDms.latitude.degrees,
      this.locationDms.latitude.minutes,
      this.locationDms.latitude.seconds,
      this.locationDms.latitude.direction,
      this.locationDms.longitude.degrees,
      this.locationDms.longitude.minutes,
      this.locationDms.longitude.seconds,
      this.locationDms.longitude.direction,
    ];
  }

  asDecimal(): LocationDecimal {
    return this.locationDec;
  }

  asDms(): LocationDms {
    return this.locationDms;
  }

  asXyzRotationBytes(): LocationXyzRotationBytes {
    return {
      longitude: LocationConverter.decimalToXyzRotation(this.locationDec.longitude),
      latitude: LocationConverter.decimalToXyzRotation(this.locationDec.latitude),
    };
  }

  // =====================================================================================================================

  public static decimalToXyzRotation(decimalDeg: number): LocationXyz {
    const wrappedDecimalDeg = ((decimalDeg % 360) + 360) % 360;
    const scaledFractionOfRotation = Math.round((wrappedDecimalDeg / 360) * Math.pow(2, 24));
    const x = Math.floor(scaledFractionOfRotation / Math.pow(2, 16));
    const remainder = scaledFractionOfRotation % Math.pow(2, 16);
    const y = Math.floor(remainder / Math.pow(2, 8));
    const z = remainder % Math.pow(2, 8);
    return { x, y, z };
  }

  public static xyzRotationToDecimal(l: LocationXyz): number {
    return ((l.x * Math.pow(2, 16) + l.y * Math.pow(2, 8) + l.z) / Math.pow(2, 24)) * 360;
  }

  public static nexstarToDecimal(nexstar: number[]): LocationDecimal {
    if (nexstar.length < 8) {
      throw new Error(`Nexstar string malformed - too short - ${nexstar}`);
    }
    const dms: LocationDms = {
      latitude: {
        degrees: nexstar[0]!,
        minutes: nexstar[1]!,
        seconds: nexstar[2]!,
        direction: nexstar[3]!,
      },
      longitude: {
        degrees: nexstar[4]!,
        minutes: nexstar[5]!,
        seconds: nexstar[6]!,
        direction: nexstar[7]!,
      },
    };
    return {
      latitude: LocationConverter.dmsToDecimal(dms.latitude),
      longitude: LocationConverter.dmsToDecimal(dms.longitude),
    };
  }

  public static dmsToDecimal(dms: LocationDmsSingleAtr): number {
    let decimal: number = dms.degrees + dms.minutes / 60 + dms.seconds / 3600;
    if (dms.direction === 1) {
      decimal = -decimal;
    }
    return decimal;
  }

  public static decimalToDms(d: number): LocationDmsSingleAtr {
    let direction;
    if (d < 0) {
      direction = 1;
    } else {
      direction = 0;
    }
    const dAbs: number = Math.abs(d);
    const degrees: number = Math.floor(dAbs);
    const minutesFloat: number = (dAbs - degrees) * 60;
    const minutes: number = Math.floor(minutesFloat);
    const secondsFloat: number = (minutesFloat - minutes) * 60;
    const seconds: number = Math.round(secondsFloat);
    return {
      degrees,
      minutes,
      seconds,
      direction,
    };
  }
}
