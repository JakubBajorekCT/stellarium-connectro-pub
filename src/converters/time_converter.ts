import { type StellariumStatusTime } from '../types/stellarium.ts';
import { DateTime } from 'luxon';

export class TimeConverter {
  private readonly dt: DateTime;

  constructor(dt: DateTime) {
    this.dt = dt;
  }

  public static fromApiSender(apiSenderTime: StellariumStatusTime): TimeConverter {
    const dt: DateTime = TimeConverter.apiSenderTimeToDateTime(apiSenderTime);
    return new TimeConverter(dt);
  }

  public static fromNexstar(nexstarTime: number[]): TimeConverter {
    const trimmedNexstarTime: number[] = nexstarTime.slice(1);
    const dt: DateTime = TimeConverter.nexstarTimeToDateTime(trimmedNexstarTime);
    return new TimeConverter(dt);
  }

  private static apiSenderTimeToDateTime(apiSenderTime: StellariumStatusTime): DateTime {
    return DateTime.fromISO(apiSenderTime.local, { zone: apiSenderTime.timeZone });
  }

  private static nexstarTimeToDateTime(nexstarTime: number[]): DateTime {
    if (!(typeof nexstarTime[5] === 'number') || !(typeof nexstarTime[6] === 'number')) {
      throw new Error(`Missing values in ${nexstarTime}`);
    }
    const offsetHours: number = nexstarTime[6] <= 128 ? nexstarTime[6] : -(256 - nexstarTime[6]);
    const zone = `utc${offsetHours >= 0 ? '+' : ''}${offsetHours}`;
    return DateTime.fromObject(
      {
        hour: nexstarTime[0],
        minute: nexstarTime[1],
        second: nexstarTime[2],
        month: nexstarTime[3],
        day: nexstarTime[4],
        year: 2000 + nexstarTime[5],
      },
      {
        zone: zone,
      },
    );
  }

  public asJulianDate(): number {
    const millis: number = this.dt.toUTC().toMillis();
    return millis / 86400000 + 2440587.5;
  }

  public asIso(): string {
    const iso: string | null = this.dt.toISO();
    if (!iso) {
      throw new Error(`Date ${this.dt} returned null iso`);
    } else {
      return iso;
    }
  }

  public asNexstar(): number[] {
    const offsetHr: number = this.dt.offset / 60;
    const offset256: number = offsetHr >= 0 ? offsetHr : 256 + offsetHr;
    const dst: number = this.dt.isInDST ? 1 : 0;
    return [
      this.dt.hour,
      this.dt.minute,
      this.dt.second,
      this.dt.month,
      this.dt.day,
      this.dt.year - 2000,
      offset256,
      dst,
    ];
  }
}
