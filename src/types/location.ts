export type LocationDecimal = {
  latitude: number;
  longitude: number;
};

export type LocationDmsSingleAtr = {
  degrees: number;
  minutes: number;
  seconds: number;
  direction: number;
};

export type LocationDms = {
  latitude: LocationDmsSingleAtr;
  longitude: LocationDmsSingleAtr;
};

export type LocationXyz = {
  x: number;
  y: number;
  z: number;
};

export type LocationXyzRotationBytes = {
  latitude: LocationXyz;
  longitude: LocationXyz;
};
