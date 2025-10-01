import type { Vector3 } from '../types/coordinates.ts';
import { logger } from '../logger.ts';

export class SlewConverter {
  private static readonly ARCSEC_IN_RADIAN: number = 206265;
  private static readonly ARCSEC_IN_DEGREE: number = 3600;
  public static readonly SLEW_DIRECTION: {
    AzmRaPositive: number;
    AzmRaNegative: number;
    AltDecPositive: number;
    AltDecNegative: number;
  } = {
    AzmRaPositive: 1,
    AzmRaNegative: 2,
    AltDecPositive: 3,
    AltDecNegative: 4,
  };

  private readonly arcsecondsPerSecond: number;
  private readonly radiansPerSecond: number;

  constructor(asec: number) {
    this.arcsecondsPerSecond = asec;
    this.radiansPerSecond = SlewConverter.asecToRad(asec);
  }

  public static fromNexstar(rateHigh: number, rateLow: number): SlewConverter {
    return new SlewConverter(SlewConverter.hiLoToAsec(rateHigh, rateLow));
  }

  public static fromStaticRate(degPerSecond: number): SlewConverter {
    return new SlewConverter(SlewConverter.degPerSecondToArcsecond(degPerSecond));
  }

  // ===================================================================================================================

  private static hiLoToAsec(high: number, low: number): number {
    return (high * 256 + low) / 4;
  }

  private static asecToRad(asec: number): number {
    return asec / SlewConverter.ARCSEC_IN_RADIAN;
  }

  private static degPerSecondToArcsecond(degPerSecond: number): number {
    return degPerSecond * SlewConverter.ARCSEC_IN_DEGREE;
  }

  // ===================================================================================================================

  public asArcsecondsPerSecond(): number {
    return this.arcsecondsPerSecond;
  }

  public moveVectorBySlew(v: Vector3, slewDirection: number): Vector3 {
    const vx: number = v[0];
    const vy: number = v[1];
    const vz: number = v[2];

    const delta: number = this.radiansPerSecond;
    const zAxis: Vector3 = [0, 0, 1];

    const dot: number = vx * zAxis[0] + vy * zAxis[1] + vz * zAxis[2];
    let nx: number = zAxis[0] - dot * vx;
    let ny: number = zAxis[1] - dot * vy;
    let nz: number = zAxis[2] - dot * vz;
    const nLen: number = Math.hypot(nx, ny, nz);
    nx /= nLen;
    ny /= nLen;
    nz /= nLen;

    let ex: number = vy * nz - vz * ny;
    let ey: number = vz * nx - vx * nz;
    let ez: number = vx * ny - vy * nx;
    const eLen: number = Math.hypot(ex, ey, ez);
    ex /= eLen;
    ey /= eLen;
    ez /= eLen;

    let dx = 0;
    let dy = 0;
    let dz = 0;
    switch (slewDirection) {
      case SlewConverter.SLEW_DIRECTION.AzmRaPositive: // east
        dx = delta * ex;
        dy = delta * ey;
        dz = delta * ez;
        break;
      case SlewConverter.SLEW_DIRECTION.AzmRaNegative: // west
        dx = -delta * ex;
        dy = -delta * ey;
        dz = -delta * ez;
        break;
      case SlewConverter.SLEW_DIRECTION.AltDecPositive: // north
        dx = delta * nx;
        dy = delta * ny;
        dz = delta * nz;
        break;
      case SlewConverter.SLEW_DIRECTION.AltDecNegative: // south
        dx = -delta * nx;
        dy = -delta * ny;
        dz = -delta * nz;
        break;
    }

    let vpx: number = vx + dx;
    let vpy: number = vy + dy;
    let vpz: number = vz + dz;

    const len: number = Math.hypot(vpx, vpy, vpz);
    vpx /= len;
    vpy /= len;
    vpz /= len;

    const dec: number = Math.asin(vpz);
    let ra: number = Math.atan2(vpy, vpx);
    if (ra < 0) {
      ra += 2 * Math.PI;
    }
    logger.debug(`Ra: ${ra} Dec: ${dec}`);

    return [vpx, vpy, vpz];
  }
}
