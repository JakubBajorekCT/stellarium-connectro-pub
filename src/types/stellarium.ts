import { type Vector3 } from './coordinates.ts';

export type StellariumStatusLocation = {
  altitude: number;
  landscapeKey: string;
  latitude: number;
  longitude: number;
  name: string;
  planet: string;
  region: string;
  role: string;
  state: string;
};

export type StellariumStatusTime = {
  deltaT: number;
  gmtShift: number;
  isTimeNow: boolean;
  jday: number;
  local: string;
  timeZone: string;
  timerate: number;
  utc: string;
};

export type StellariumStatusView = {
  fov: number;
};

// =====================================================================================================================

export type StellariumStatus = {
  location: StellariumStatusLocation;
  selectioninfo: string;
  time: StellariumStatusTime;
  view: StellariumStatusView;
};

export type StellariumView = {
  altAz: Vector3;
  j2000: Vector3;
  jNow: Vector3;
};
