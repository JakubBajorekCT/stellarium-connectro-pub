import { asciiArrayToString } from '../../src/shared_helpers';
import type { StellariumStatus, StellariumStatusTime } from '../../src/types/stellarium';

const time1api: StellariumStatusTime = {
  deltaT: 0.0007889659861037449,
  gmtShift: 0.08333333333333333,
  isTimeNow: true,
  jday: 2460911.469588611,
  local: '2025-08-24T01:16:12.456',
  timeZone: 'UTC+04:00',
  timerate: 1.1574074074074073e-5,
  utc: '2025-08-23T23:16:12.456Z',
};
const time1apiFull: StellariumStatus = {
  location: {
    altitude: 0,
    landscapeKey: '',
    latitude: 52.23939895629883,
    longitude: 21.03619956970215,
    name: '52.2394, 21.0362',
    planet: 'Earth',
    region: 'Eastern Europe',
    role: 'X',
    state: 'IPregion',
  },
  selectioninfo: '',
  time: time1api,
  view: {
    fov: 60,
  },
};

const time1NexstarNumber: number[] = [1, 16, 12, 8, 24, 25, 4, 0];
const time1NexstarString: string = asciiArrayToString(time1NexstarNumber);
const time1Iso = '2025-08-24T01:16:12.456+04:00';

// =====================================================================================================================

const time2NexstarNumber: number[] = [15, 25, 59, 8, 5, 25, 251, 0];
const time2NexstarString: string = asciiArrayToString(time2NexstarNumber);
const time2Iso = '2025-08-05T15:25:59.000-05:00';
const time2Julian = 2460893.351377315;

// =====================================================================================================================

export const time: {
  t1: {
    api: typeof time1api;
    apiFull: typeof time1apiFull;
    nexstarNumber: typeof time1NexstarNumber;
    nexstarString: typeof time1NexstarString;
    iso: typeof time1Iso;
  };
  t2: {
    nexstarString: typeof time2NexstarString;
    nexstarNumber: typeof time2NexstarNumber;
    iso: typeof time2Iso;
    julian: typeof time2Julian;
  };
} = {
  t1: {
    api: time1api,
    apiFull: time1apiFull,
    nexstarNumber: time1NexstarNumber,
    nexstarString: time1NexstarString,
    iso: time1Iso,
  },
  t2: {
    nexstarString: time2NexstarString,
    nexstarNumber: time2NexstarNumber,
    iso: time2Iso,
    julian: time2Julian,
  },
};
