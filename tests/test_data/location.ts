import { asciiArrayToString } from '../../src/shared_helpers';
import type { StellariumStatus, StellariumStatusLocation } from '../../src/types/stellarium';
import type { LocationDecimal, LocationDms } from '../../src/types/location';

const location1api: StellariumStatusLocation = {
  altitude: 1136,
  landscapeKey: '',
  latitude: -15.779720306396484,
  longitude: -47.92972183227539,
  name: 'Brasilia',
  planet: 'Earth',
  region: 'Southern America',
  role: 'C',
  state: 'Federal District',
};

const location1apiFull: StellariumStatus = {
  location: location1api,
  selectioninfo: '',
  time: {
    deltaT: 0.0007889602437808774,
    gmtShift: -0.125,
    isTimeNow: true,
    jday: 2460923.3107925113,
    local: '2025-09-04T16:27:32.473',
    timeZone: 'UTC-03:00',
    timerate: 0.000011574074074074073,
    utc: '2025-09-04T19:27:32.473Z',
  },
  view: {
    fov: 60,
  },
};

const location1NexstarNumber: number[] = [15, 46, 47, 1, 47, 55, 47, 1];
const location1dms: LocationDms = {
  latitude: {
    degrees: 15,
    minutes: 46,
    seconds: 47,
    direction: 1,
  },
  longitude: {
    degrees: 47,
    minutes: 55,
    seconds: 47,
    direction: 1,
  },
};
const location1gpsXyzArray = {
  latitude: [244, 199, 100, 35],
  longitude: [221, 234, 169, 35],
};
const location1gpsXyzObject = {
  latitude: { x: 244, y: 199, z: 100 },
  longitude: { x: 221, y: 234, z: 169 },
};
// =====================================================================================================================

const location2NexstarNumber: number[] = [26, 32, 31, 1, 30, 40, 1, 0];
const location2decimal: LocationDecimal = {
  latitude: -26.542,
  longitude: 30.667,
};
const location2dms: LocationDms = {
  latitude: {
    degrees: 26,
    minutes: 32,
    seconds: 31,
    direction: 1,
  },
  longitude: {
    degrees: 30,
    minutes: 40,
    seconds: 1,
    direction: 0,
  },
};
const location2gpsXyzObject = {
  latitude: { x: 237, y: 32, z: 48 },
  longitude: { x: 21, y: 206, z: 191 },
};
// =====================================================================================================================

export const location = {
  l1: {
    api: location1api,
    apiFull: location1apiFull,
    nexstarNumber: location1NexstarNumber,
    nexstarString: asciiArrayToString(location1NexstarNumber),
    dms: location1dms,
    xyzArr: location1gpsXyzArray,
    xyzObj: location1gpsXyzObject,
  },
  l2: {
    nexstarString: asciiArrayToString(location2NexstarNumber),
    decimal: location2decimal,
    dms: location2dms,
    xyzObj: location2gpsXyzObject,
  },
};
