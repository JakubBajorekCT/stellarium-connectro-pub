import { type AzmAlt, type Vector3 } from '../../src/types/coordinates';
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
const coords1Vector3: Vector3 = [0.670155, -0.171498, 0.722137];
const coords1AzmAlt: AzmAlt = { azimuth: 194.35438736468728, altitude: 46.23119812808416 };
const coords1Basic = '8A35,20E0';
const coords1Precise = '8A3522F0,20E021FE';
const coords1BasicNumber: number[] = [56, 65, 51, 53, 44, 50, 48, 69, 48];
const coords1PreciseNumber: number[] = [
  56, 65, 51, 53, 50, 50, 70, 48, 44, 50, 48, 69, 48, 50, 49, 70, 69,
];

// =====================================================================================================================

// azm 240
// alt 36
const apiCoords2Raw = {
  altAz: JSON.stringify([0.40072, -0.701235, 0.589655]),
  j2000: JSON.stringify([-0.106491, -0.970237, 0.217486]),
  jNow: JSON.stringify([-0.10145, -0.970845, 0.217182]),
};
const apiCoords2: StellariumView = {
  altAz: [0.40072, -0.701235, 0.589655],
  j2000: [-0.106491, -0.970237, 0.217486],
  jNow: [-0.10145, -0.970845, 0.217182],
};
const coords2Vector3: Vector3 = [0.40072, -0.701235, 0.589655];
const coords2AzmAlt: AzmAlt = { azimuth: 240.25423878968098, altitude: 36.13252977639863 };
const coords2Basic = 'AAD9,19B2';
const coords2Precise = 'AAD8F30E,19B1B9EF';
const coords2BasicNumber: number[] = [65, 65, 68, 57, 44, 49, 57, 66, 50];
const coords2PreciseNumber: number[] = [
  65, 65, 68, 56, 70, 51, 48, 69, 44, 49, 57, 66, 49, 66, 57, 69, 70,
];

// =====================================================================================================================

// azm 354
// alt -21
const apiCoords3Raw = {
  altAz: JSON.stringify([-0.927394, -0.0829666, -0.36477]),
  j2000: JSON.stringify([-0.719943, 0.632198, 0.28637]),
  jNow: JSON.stringify([-0.724282, 0.62803, 0.284594]),
};
const apiCoords3: StellariumView = {
  altAz: [-0.927394, -0.0829666, -0.36477],
  j2000: [-0.719943, 0.632198, 0.28637],
  jNow: [-0.724282, 0.62803, 0.284594],
};
const coords3Vector3: Vector3 = [-0.927394, -0.0829666, -0.36477];
const coords3AzmAlt: AzmAlt = { azimuth: 354.8878095809861, altitude: -21.393428799563775 };
const coords3Basic = 'FC5D,F0C9';
const coords3Precise = 'FC5D5AA9,F0C971F5';
const coords3BasicNumber: number[] = [70, 67, 53, 68, 44, 70, 48, 67, 57];
const coords3PreciseNumber: number[] = [
  70, 67, 53, 68, 53, 65, 65, 57, 44, 70, 48, 67, 57, 55, 49, 70, 53,
];

// =====================================================================================================================

export const azmalt = {
  c1: {
    api: apiCoords1,
    apiRaw: apiCoords1Raw,
    v3: coords1Vector3,
    azmalt: coords1AzmAlt,
    basic: coords1Basic,
    precise: coords1Precise,
    basicNumber: coords1BasicNumber,
    preciseNumber: coords1PreciseNumber,
  },
  c2: {
    api: apiCoords2,
    apiRaw: apiCoords2Raw,
    v3: coords2Vector3,
    azmalt: coords2AzmAlt,
    basic: coords2Basic,
    precise: coords2Precise,
    basicNumber: coords2BasicNumber,
    preciseNumber: coords2PreciseNumber,
  },
  c3: {
    api: apiCoords3,
    apiRaw: apiCoords3Raw,
    v3: coords3Vector3,
    azmalt: coords3AzmAlt,
    basic: coords3Basic,
    precise: coords3Precise,
    basicNumber: coords3BasicNumber,
    preciseNumber: coords3PreciseNumber,
  },
};
