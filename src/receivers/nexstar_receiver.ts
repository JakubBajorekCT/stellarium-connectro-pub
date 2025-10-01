import { BaseReceiver, type BaseReceiverOptions } from './base_receiver.ts';
import { logger } from '../logger.ts';

import type {
  StellariumView,
  StellariumStatusTime,
  StellariumStatusLocation,
} from '../types/stellarium.ts';

import { LocationConverter } from '../converters/location_converter.ts';
import { TimeConverter } from '../converters/time_converter.ts';
import { CoordinatesRaDecConverter } from '../converters/coordinates_radec_converter.ts';
import { CoordinatesAzmAltConverter } from '../converters/coordinates_azmalt_converter.ts';
import { SlewConverter } from '../converters/slew_converter.ts';
import { asciiArrayToString } from '../shared_helpers.ts';
import { type Vector3 } from '../types/coordinates.ts';
import { type LocationXyzRotationBytes } from '../types/location.ts';

export type NexstarReceiverOptions = BaseReceiverOptions & {};

// speed level 9 - 3 degrees per second, lower -> divide by 2
export const FIXED_SLEW_SPEED: Record<number, number> = {
  1: 0.01171875,
  2: 0.0234375,
  3: 0.046875,
  4: 0.09375,
  5: 0.1875,
  6: 0.375,
  7: 0.75,
  8: 1.5,
  9: 3.0,
};

export const MODELS = {
  GpsSeries: 1,
  iSeries: 3,
  iSeriesSE: 4,
  CGE: 5,
  AdvancedGT: 6,
  SLT: 7,
  CPC: 9,
  GT: 10,
  _4_5_SE: 11,
  _6_8_SE: 12,
};

export const TRACKING_MODES = {
  Off: 0,
  AltAz: 1,
  EQNorth: 2,
  EQSouth: 3,
};

export const ALIGNMENT = {
  INCOMPLETE: 0,
  COMPLETE: 1,
};

export const GOTO = {
  IN_PROCESS: 49,
  NOT_IN_PROCESS: 48,
};

export const GPS_LINKED = {
  NO: 0,
  YES: 1,
};

export class NexstarReceiver extends BaseReceiver {
  public static readonly DEFAULT_VERSION: number[] = [4, 10];
  public static readonly DEFAULT_MODEL: number[] = [MODELS._6_8_SE];
  public static readonly DEFAULT_AZM_RA_MOTOR_VERSION: number[] = [1, 0];
  public static readonly DEFAULT_ALT_DEC_MOTOR_VERSION: number[] = [1, 0];
  public static readonly DEFAULT_GPS_VERSION: number[] = [1, 0];
  public static readonly DEFAULT_RTC_VERSION: number[] = [1, 0];
  public static readonly DEFAULT_IS_GPS_LINKED: number = GPS_LINKED.YES;

  public static readonly DEFAULT_TRACKING_MODE: number = TRACKING_MODES.AltAz;

  private readonly opts: NexstarReceiverOptions;
  private currentTrackingMode: number = NexstarReceiver.DEFAULT_TRACKING_MODE;
  private action: string;

  constructor(opts: NexstarReceiverOptions) {
    super();
    this.opts = opts;
    this.action = '';
  }

  public override async process(data: Buffer<ArrayBufferLike>): Promise<number[]> {
    const dataArray: number[] = Array.from(data);
    if (dataArray.length === 0) {
      throw new Error(`Empty array received by process method`);
    }
    const commandPrefix: string = String.fromCharCode(dataArray[0]!);
    let response: number[] = [];
    switch (commandPrefix) {
      // get position commands
      case 'e':
        this.action = '#getPreciseRaDec';
        response = await this.getPreciseRaDec();
        break;
      case 'E':
        this.action = '#getBasicRaDec';
        response = await this.getBasicRaDec();
        break;
      case 'z':
        this.action = '#getPreciseAzmAlt';
        response = await this.getPreciseAzmAlt();
        break;
      case 'Z':
        this.action = '#getBasicAzmAlt';
        response = await this.getBasicAzmAlt();
        break;

      // goto commands
      case 'r':
        this.action = '#gotoPreciseRaDec';
        response = await this.gotoPreciseRaDec(dataArray);
        break;
      case 'R':
        this.action = '#gotoBasicRaDec';
        response = await this.gotoBasicRaDec(dataArray);
        break;
      case 'b':
        this.action = '#gotoPreciseAzmAlt';
        response = await this.gotoPreciseAzmAlt(dataArray);
        break;
      case 'B':
        this.action = '#gotoBasicAzmAlt';
        response = await this.gotoBasicAzmAlt(dataArray);
        break;

      // sync commands
      case 's':
        this.action = '#syncPreciseRaDec';
        response = await this.syncPreciseRaDec(dataArray);
        break;
      case 'S':
        this.action = '#syncBasicRaDec';
        response = await this.syncBasicRaDec(dataArray);
        break;

      // tracking commands
      case 't':
        this.action = '#getTrackingMode';
        response = this.getTrackingMode();
        break;
      case 'T':
        this.action = '#setTrackingMode';
        response = this.setTrackingMode(dataArray);
        break;

      // rotation commands / gps commands / rtc commands
      case 'P':
        response = await this.handlePCommand(dataArray);
        break;

      // time and location commands
      case 'w':
        this.action = '#getLocation';
        response = await this.getLocation();
        break;
      case 'W':
        this.action = '#setLocation';
        response = await this.setLocation(dataArray);
        break;
      case 'h':
        this.action = '#getTime';
        response = await this.getTime();
        break;
      case 'H':
        this.action = '#setTime';
        response = await this.setTime(dataArray);
        break;

      // misc commands
      case 'V':
        this.action = '#getVersion';
        response = this.getVersion();
        break;
      case 'm':
        this.action = '#getModel';
        response = this.getModel();
        break;
      case 'K':
        this.action = '#echo';
        response = this.echo(dataArray);
        break;
      case 'J':
        this.action = '#isAlignmentComplete';
        response = this.isAlignmentComplete();
        break;
      case 'L':
        this.action = '#isGotoInProcess';
        response = this.isGotoInProcess();
        break;
      case 'M':
        this.action = '#cancelGoto';
        response = this.cancelGoto();
        break;
      default:
        logger.error(`Unknown command: [${dataArray}]`);
    }
    this.log(this.action, dataArray, response);
    return [...response, 35];
  }

  // ===================================================================================================================
  // =========================================== POSITION COMMANDS =====================================================
  // ===================================================================================================================

  private async getPreciseRaDec(): Promise<number[]> {
    const coordinates: StellariumView = await this.opts.sender.getViewCoordinates();
    logger.debug(coordinates);
    const converter: CoordinatesRaDecConverter =
      CoordinatesRaDecConverter.fromApiSender(coordinates);
    return converter.asPreciseNexstarRaDec();
  }

  private async getBasicRaDec(): Promise<number[]> {
    const coordinates: StellariumView = await this.opts.sender.getViewCoordinates();
    logger.debug(coordinates);
    const converter: CoordinatesRaDecConverter =
      CoordinatesRaDecConverter.fromApiSender(coordinates);
    return converter.asBasicNexstarRaDec();
  }

  private async getPreciseAzmAlt(): Promise<number[]> {
    const coordinates: StellariumView = await this.opts.sender.getViewCoordinates();
    logger.debug(coordinates);
    const converter: CoordinatesAzmAltConverter =
      CoordinatesAzmAltConverter.fromApiSender(coordinates);
    return converter.asPreciseNexstarAmzAlt();
  }

  private async getBasicAzmAlt(): Promise<number[]> {
    const coordinates: StellariumView = await this.opts.sender.getViewCoordinates();
    logger.debug(coordinates);
    const converter: CoordinatesAzmAltConverter =
      CoordinatesAzmAltConverter.fromApiSender(coordinates);
    return converter.asBasicNexstarAzmAlt();
  }

  // ===================================================================================================================
  // =========================================== GOTO COMMANDS =========================================================
  // ===================================================================================================================

  private async gotoPreciseRaDec(dataArray: number[]): Promise<number[]> {
    const converter: CoordinatesRaDecConverter = CoordinatesRaDecConverter.fromNexstar(
      dataArray,
      true,
    );
    logger.debug(converter);
    await this.opts.sender.setViewCoordinates(converter.asVector3(), 'j2000');
    return [];
  }

  private async gotoBasicRaDec(dataArray: number[]): Promise<number[]> {
    const converter: CoordinatesRaDecConverter = CoordinatesRaDecConverter.fromNexstar(
      dataArray,
      false,
    );
    logger.debug(converter);
    await this.opts.sender.setViewCoordinates(converter.asVector3(), 'j2000');
    return [];
  }

  private async gotoPreciseAzmAlt(dataArray: number[]): Promise<number[]> {
    const converter: CoordinatesAzmAltConverter = CoordinatesAzmAltConverter.fromNexstar(
      dataArray,
      true,
    );
    logger.debug(converter);
    await this.opts.sender.setViewCoordinates(converter.asVector3(), 'altAz');
    return [];
  }

  private async gotoBasicAzmAlt(dataArray: number[]): Promise<number[]> {
    const converter: CoordinatesAzmAltConverter = CoordinatesAzmAltConverter.fromNexstar(
      dataArray,
      false,
    );
    logger.debug(converter);
    await this.opts.sender.setViewCoordinates(converter.asVector3(), 'altAz');
    return [];
  }

  // ===================================================================================================================
  // =========================================== SYNC COMMANDS =========================================================
  // ===================================================================================================================

  private async syncPreciseRaDec(dataArray: number[]): Promise<number[]> {
    const converter: CoordinatesRaDecConverter = CoordinatesRaDecConverter.fromNexstar(
      dataArray,
      true,
    );
    logger.debug(converter);
    await this.opts.sender.setViewCoordinates(converter.asVector3(), 'j2000');
    return [];
  }

  private async syncBasicRaDec(dataArray: number[]): Promise<number[]> {
    const converter: CoordinatesRaDecConverter = CoordinatesRaDecConverter.fromNexstar(
      dataArray,
      false,
    );
    logger.debug(converter);
    await this.opts.sender.setViewCoordinates(converter.asVector3(), 'j2000');
    return [];
  }

  // ===================================================================================================================
  // =========================================== TRACKING COMMANDS =====================================================
  // ===================================================================================================================

  private getTrackingMode(): number[] {
    return [this.currentTrackingMode];
  }

  private setTrackingMode(dataArray: number[]): number[] {
    if (dataArray.length !== 2) {
      throw new Error(`Invalid array size for: ${dataArray}`);
    }
    this.currentTrackingMode = dataArray[1]!;
    return [];
  }

  // ===================================================================================================================
  // ================================ ROTATION / GPS / RTC COMMANDS ====================================================
  // ===================================================================================================================

  private async handlePCommand(dataArray: number[]): Promise<number[]> {
    let response: number[] = [];
    const command: string = dataArray.slice(0, 4).join('-');
    switch (command) {
      case '80-3-16-6':
        this.action = '#pVariableRateAzmRaSlewPositive';
        response = await this.pVariableRateAzmRaSlewPositive(dataArray);
        break;
      case '80-3-16-7':
        this.action = '#pVariableRateAzmRaSlewNegative';
        response = await this.pVariableRateAzmRaSlewNegative(dataArray);
        break;
      case '80-3-17-6':
        this.action = '#pVariableRateAltDecSlewPositive';
        response = await this.pVariableRateAltDecSlewPositive(dataArray);
        break;
      case '80-3-17-7':
        this.action = '#pVariableRateAltDecSlewNegative';
        response = await this.pVariableRateAltDecSlewNegative(dataArray);
        break;
      // =============================================================================
      case '80-2-16-36':
        this.action = '#pFixedRateAzmRaSlewPositive';
        response = await this.pFixedRateAzmRaSlewPositive(dataArray);
        break;
      case '80-2-16-37':
        this.action = '#pFixedRateAzmRaSlewNegative';
        response = await this.pFixedRateAzmRaSlewNegative(dataArray);
        break;
      case '80-2-17-36':
        this.action = '#pFixedRateAltDecSlewPositive';
        response = await this.pFixedRateAltDecSlewPositive(dataArray);
        break;
      case '80-2-17-37':
        this.action = '#pFixedRateAltDecSlewNegative';
        response = await this.pFixedRateAltDecSlewNegative(dataArray);
        break;
      // =============================================================================
      case '80-1-176-3': // gps
      case '80-1-178-3': // rtc
        this.action = '#pGetDate';
        response = this.pGetDate();
        break;
      case '80-1-176-4': // gps
      case '80-1-178-4': // rtc
        this.action = '#pGetYear';
        response = this.pGetYear();
        break;
      case '80-1-176-51': // gps
      case '80-1-178-51': // rtc
        this.action = '#pGetTime';
        response = this.pGetTime();
        break;
      // =============================================================================
      case '80-1-176-55':
        this.action = '#pIsGpsLinked';
        response = await this.pIsGpsLinked();
        break;
      case '80-1-176-1':
        this.action = '#pGpsGetLatitude';
        response = await this.pGpsGetLatitude();
        break;
      case '80-1-176-2':
        this.action = '#pGpsGetLongitude';
        response = await this.pGpsGetLongitude();
        break;
      // =============================================================================
      case '80-3-178-131':
        this.action = '#pRtcSetDate';
        response = this.pRtcSetDate();
        break;
      case '80-3-178-132':
        this.action = '#pRtcSetYear';
        response = this.pRtcSetYear();
        break;
      case '80-4-178-179':
        this.action = '#pRtcSetTime';
        response = this.pRtcSetTime();
        break;
      case '80-1-16-254':
      case '80-1-17-254':
      case '80-1-176-254':
      case '80-1-178-254':
        this.action = '#pGetDeviceVersion';
        response = this.pGetDeviceVersion(dataArray);
        break;
      default:
        logger.error(`Unknown P subcommand command: ${dataArray}`);
    }
    return response;
  }

  private async pMoveByRate(rate: number | [number, number], direction: number): Promise<void> {
    let converter: SlewConverter;
    if (Array.isArray(rate)) {
      converter = SlewConverter.fromNexstar(rate[0], rate[1]);
    } else {
      if (!FIXED_SLEW_SPEED[rate]) {
        throw new Error(`Invalid fixed speed for rate: ${rate}`);
      }
      converter = SlewConverter.fromStaticRate(FIXED_SLEW_SPEED[rate]!);
    }
    const currentCoordinates: StellariumView = await this.opts.sender.getViewCoordinates();
    const newCoordinates: Vector3 = converter.moveVectorBySlew(currentCoordinates.j2000, direction);
    logger.debug(currentCoordinates);
    logger.debug(newCoordinates);
    await this.opts.sender.setViewCoordinates(newCoordinates, 'j2000');
  }

  // P, 3, 16, 6, a, b, 0, 0
  private async pVariableRateAzmRaSlewPositive(dataArray: number[]): Promise<number[]> {
    if (dataArray.length !== 8) {
      throw new Error(`Invalid array size for: ${dataArray}`);
    }
    const rateHigh: number = dataArray[4]!;
    const rateLow: number = dataArray[5]!;
    await this.pMoveByRate([rateHigh, rateLow], SlewConverter.SLEW_DIRECTION.AzmRaPositive);
    return [];
  }

  // P, 3, 16, 7, a, b, 0, 0
  private async pVariableRateAzmRaSlewNegative(dataArray: number[]): Promise<number[]> {
    if (dataArray.length !== 8) {
      throw new Error(`Invalid array size for: ${dataArray}`);
    }
    const rateHigh: number = dataArray[4]!;
    const rateLow: number = dataArray[5]!;
    await this.pMoveByRate([rateHigh, rateLow], SlewConverter.SLEW_DIRECTION.AzmRaNegative);
    return [];
  }

  // P, 3, 17, 6, a, b, 0, 0
  private async pVariableRateAltDecSlewPositive(dataArray: number[]): Promise<number[]> {
    if (dataArray.length !== 8) {
      throw new Error(`Invalid array size for: ${dataArray}`);
    }
    const rateHigh: number = dataArray[4]!;
    const rateLow: number = dataArray[5]!;
    await this.pMoveByRate([rateHigh, rateLow], SlewConverter.SLEW_DIRECTION.AltDecPositive);
    return [];
  }

  // P, 3, 17, 7, a, b, 0, 0
  private async pVariableRateAltDecSlewNegative(dataArray: number[]): Promise<number[]> {
    if (dataArray.length !== 8) {
      throw new Error(`Invalid array size for: ${dataArray}`);
    }
    const rateHigh: number = dataArray[4]!;
    const rateLow: number = dataArray[5]!;
    await this.pMoveByRate([rateHigh, rateLow], SlewConverter.SLEW_DIRECTION.AltDecNegative);
    return [];
  }

  // -----------------------

  // P, 2, 16, 36, a, 0, 0, 0
  private async pFixedRateAzmRaSlewPositive(dataArray: number[]): Promise<number[]> {
    if (dataArray.length !== 8) {
      throw new Error(`Invalid array size for: ${dataArray}`);
    }
    const rate: number = dataArray[4]!;
    if (rate > 0) {
      await this.pMoveByRate(rate, SlewConverter.SLEW_DIRECTION.AzmRaPositive);
    }
    return [];
  }

  // P, 2, 16, 37, a, 0, 0, 0
  private async pFixedRateAzmRaSlewNegative(dataArray: number[]): Promise<number[]> {
    if (dataArray.length !== 8) {
      throw new Error(`Invalid array size for: ${dataArray}`);
    }
    const rate: number = dataArray[4]!;
    if (rate > 0) {
      await this.pMoveByRate(rate, SlewConverter.SLEW_DIRECTION.AzmRaNegative);
    }
    return [];
  }

  // P, 2, 17, 36, a, 0, 0, 0
  private async pFixedRateAltDecSlewPositive(dataArray: number[]): Promise<number[]> {
    if (dataArray.length !== 8) {
      throw new Error(`Invalid array size for: ${dataArray}`);
    }
    const rate: number = dataArray[4]!;
    if (rate > 0) {
      await this.pMoveByRate(rate, SlewConverter.SLEW_DIRECTION.AltDecPositive);
    }
    return [];
  }

  // P, 2, 17, 37, a, 0, 0, 0
  private async pFixedRateAltDecSlewNegative(dataArray: number[]): Promise<number[]> {
    if (dataArray.length !== 8) {
      throw new Error(`Invalid array size for: ${dataArray}`);
    }
    const rate: number = dataArray[4]!;
    if (rate > 0) {
      await this.pMoveByRate(rate, SlewConverter.SLEW_DIRECTION.AltDecNegative);
    }
    return [];
  }

  // -----------------------

  // rtc P, 1, 178, 3, 0, 0, 0, 2
  // gps P, 1, 176, 3, 0, 0, 0, 2
  private pGetDate(): number[] {
    const now = new Date();
    const month: number = now.getMonth() + 1;
    const day: number = now.getDate();
    return [month, day];
  }

  // rtc P, 1, 178, 4, 0, 0, 0, 2
  // gps P, 1, 176, 4, 0, 0, 0, 2
  private pGetYear(): number[] {
    const now = new Date();
    const year: number = now.getFullYear();
    const a: number = Math.trunc(year / 256);
    const b: number = year % 256;
    return [a, b];
  }

  // rtc P, 1, 178, 51, 0, 0, 0, 3
  // gps P, 1, 176, 51, 0, 0, 0, 3
  private pGetTime(): number[] {
    const now = new Date();
    const hours: number = now.getHours();
    const minutes: number = now.getMinutes();
    const seconds: number = now.getSeconds();
    return [hours, minutes, seconds];
  }

  // -----------------------

  // P, 1, 176, 55, 0, 0, 0, 1
  private async pIsGpsLinked(): Promise<number[]> {
    return [NexstarReceiver.DEFAULT_IS_GPS_LINKED];
  }

  private async pGetLocation(): Promise<LocationXyzRotationBytes> {
    const apiLocation: StellariumStatusLocation = await this.opts.sender.getLocation();
    const converter: LocationConverter = LocationConverter.fromApiSender(apiLocation);
    return converter.asXyzRotationBytes();
  }

  // P, 1, 176, 1, 0, 0, 0, 3
  private async pGpsGetLatitude(): Promise<number[]> {
    const res: LocationXyzRotationBytes = await this.pGetLocation();
    return [res.latitude.x, res.latitude.y, res.latitude.z];
  }

  // P, 1, 176, 2, 0, 0, 0, 3
  private async pGpsGetLongitude(): Promise<number[]> {
    const res: LocationXyzRotationBytes = await this.pGetLocation();
    return [res.longitude.x, res.longitude.y, res.longitude.z];
  }

  // -----------------------

  // P, 3, 178, 131, x, y, 0, 0
  private pRtcSetDate(): number[] {
    // we simulate rtc as system clock
    return [];
  }

  // P, 3, 178, 132, x, y, 0, 0
  private pRtcSetYear(): number[] {
    // we simulate rtc as system clock
    return [];
  }

  // P, 4, 178, 179, x, y, z, 0
  private pRtcSetTime(): number[] {
    // we simulate rtc as system clock
    return [];
  }

  // -----------------------

  // P, 1, dev, 254, 0, 0, 0, 22
  private pGetDeviceVersion(dataArray: number[]): number[] {
    let response: number[];
    switch (dataArray[2]) {
      case 16:
        response = NexstarReceiver.DEFAULT_AZM_RA_MOTOR_VERSION;
        break;
      case 17:
        response = NexstarReceiver.DEFAULT_ALT_DEC_MOTOR_VERSION;
        break;
      case 176:
        response = NexstarReceiver.DEFAULT_GPS_VERSION;
        break;
      case 178:
        response = NexstarReceiver.DEFAULT_RTC_VERSION;
        break;
      default:
        throw new Error(`No version for device type: ${dataArray}`);
    }
    return response;
  }

  // ===================================================================================================================
  // ================================ TIME AND LOCATION COMMANDS =======================================================
  // ===================================================================================================================

  private async getLocation(): Promise<number[]> {
    const apiLocation: StellariumStatusLocation = await this.opts.sender.getLocation();
    const converter: LocationConverter = LocationConverter.fromApiSender(apiLocation);
    return converter.asNexstar();
  }

  private async setLocation(dataArray: number[]): Promise<number[]> {
    const converter: LocationConverter = LocationConverter.fromNexstar(dataArray);
    await this.opts.sender.setLocation(converter.asDecimal());
    return [];
  }

  private async getTime(): Promise<number[]> {
    const apiTime: StellariumStatusTime = await this.opts.sender.getTime();
    const converter: TimeConverter = TimeConverter.fromApiSender(apiTime);
    return converter.asNexstar();
  }

  private async setTime(dataArray: number[]): Promise<number[]> {
    const converter: TimeConverter = TimeConverter.fromNexstar(dataArray);
    await this.opts.sender.setTime(converter.asJulianDate());
    return [];
  }

  // ===================================================================================================================
  // ================================ MISC COMMANDS ====================================================================
  // ===================================================================================================================

  private getVersion(): number[] {
    return NexstarReceiver.DEFAULT_VERSION;
  }

  private getModel(): number[] {
    return NexstarReceiver.DEFAULT_MODEL;
  }

  private echo(dataArray: number[]): number[] {
    if (dataArray.length !== 2) {
      throw new Error(`Invalid array size for: ${dataArray}`);
    }
    return [dataArray[1]!];
  }

  private isAlignmentComplete(): number[] {
    return [ALIGNMENT.COMPLETE];
  }

  private isGotoInProcess(): number[] {
    return [GOTO.NOT_IN_PROCESS];
  }

  private cancelGoto(): number[] {
    return [];
  }

  // ===================================================================================================================

  private log(
    func: string,
    dataArray: number[],
    response: number[],
    level: keyof typeof logger = 'info',
  ) {
    const method = logger[level];
    method(
      `Received: ${func} "${asciiArrayToString(dataArray.slice(0, 1))}" [${dataArray}] ==> [${response}]`,
    );
  }
}
