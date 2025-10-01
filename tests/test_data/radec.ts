import { type RaDec, type Vector3 } from '../../src/types/coordinates';
import { type StellariumView } from '../../src/types/stellarium';

const apiCoords1Raw = {
  altAz: JSON.stringify([0.670155, -0.171498, 0.722137]),
  j2000: JSON.stringify([0.466817, -0.8708, 0.154234]),
  jNow: JSON.stringify([0.471433, -0.868108, 0.155368]),
};
const apiCoords1: StellariumView = {
  altAz: [0.670155, -0.171498, 0.722137],
  j2000: [0.466817, -0.8708, 0.154234],
  jNow: [0.471433, -0.868108, 0.155368],
};
const coords1Vector3: Vector3 = [0.466817, -0.8708, 0.154234];
const coords1RaDec: RaDec = { raHours: 19.879652941462165, decDeg: 8.872373477963198 };
const coords1Basic = 'D40D,064F';
const coords1Precise = 'D40CB4A4,064F2A93';
const coords1BasicNumber: number[] = [68, 52, 48, 68, 44, 48, 54, 52, 70];
const coords1PreciseNumber: number[] = [
  68, 52, 48, 67, 66, 52, 65, 52, 44, 48, 54, 52, 70, 50, 65, 57, 51,
];

// =====================================================================================================================

// Ra 7h40min
// Dec +5 deg

const apiCoords2Raw = {
  altAz: JSON.stringify([-0.738594, 0.488935, -0.464135]),
  j2000: JSON.stringify([-0.417966, 0.903897, 0.090968]),
  jNow: JSON.stringify([-0.423387, 0.901472, 0.0899573]),
};
const apiCoords2: StellariumView = {
  altAz: [-0.738594, 0.488935, -0.464135],
  j2000: [-0.417966, 0.903897, 0.090968],
  jNow: [-0.423387, 0.901472, 0.0899573],
};
const coords2Vector3: Vector3 = [-0.417966, 0.903897, 0.090968];
const coords2RaDec: RaDec = { raHours: 7.654402100792915, decDeg: 5.219297856223225 };
const coords2Basic = '51A6,03B6';
const coords2Precise = '51A59EE4,03B624E9';
const coords2BasicNumber: number[] = [53, 49, 65, 54, 44, 48, 51, 66, 54];
const coords2PreciseNumber: number[] = [
  53, 49, 65, 53, 57, 69, 69, 52, 44, 48, 51, 66, 54, 50, 52, 69, 57,
];

// =====================================================================================================================

export const radec = {
  c1: {
    api: apiCoords1,
    apiRaw: apiCoords1Raw,
    v3: coords1Vector3,
    radec: coords1RaDec,
    basic: coords1Basic,
    precise: coords1Precise,
    basicNumber: coords1BasicNumber,
    preciseNumber: coords1PreciseNumber,
  },
  c2: {
    api: apiCoords2,
    apiRaw: apiCoords2Raw,
    v3: coords2Vector3,
    radec: coords2RaDec,
    basic: coords2Basic,
    precise: coords2Precise,
    basicNumber: coords2BasicNumber,
    preciseNumber: coords2PreciseNumber,
  },
};
