export type Vector3 = [number, number, number];

export type RaDec = {
  raHours: number;
  decDeg: number;
};

export type AzmAlt = {
  altitude: number;
  azimuth: number;
};

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export function isRaDec(obj: any): obj is RaDec {
  return 'raHours' in obj && 'decDeg' in obj;
}

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export function isVector3(obj: any): obj is Vector3 {
  return Array.isArray(obj) && obj.length === 3 && obj.every(n => typeof n === 'number');
}
