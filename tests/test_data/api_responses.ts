import type { StellariumStatus, StellariumView } from '../../src/types/stellarium';

export const viewData1: StellariumView = {
  altAz: [1, 2, 3],
  j2000: [4, 5, 6],
  jNow: [7, 8, 9],
};

export const viewData1Raw = {
  altAz: JSON.stringify([1, 2, 3]),
  j2000: JSON.stringify([4, 5, 6]),
  jNow: JSON.stringify([7, 8, 9]),
};

export const statusData1: StellariumStatus = {
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
  time: {
    deltaT: 0.0007889640724932228,
    gmtShift: 0.08333333333333333,
    isTimeNow: true,
    jday: 2460915.440881088,
    local: '2025-08-28T00:34:52.126',
    timeZone: 'UTC+02:00',
    timerate: 0.000011574074074074073,
    utc: '2025-08-27T22:34:52.126Z',
  },
  view: {
    fov: 60,
  },
};
