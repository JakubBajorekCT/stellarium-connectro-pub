import nock from 'nock';
import mockdate from 'mockdate';
import {
  StellariumConnectroServer,
  type StellariumConnectroServerOptions,
} from '../src/stellarium_connectro_server';
import { SocketClient, coordinatesBodyToArray, coordinatesBodyToNumber } from './test_helpers';
import {
  asciiArrayToString,
  stringToAsciiArray,
  roundToPrecision,
  roundArrayToPrecision,
} from '../src/shared_helpers.ts';

import { ApiSender } from '../src/senders/api_sender';
const sender: ApiSender = new ApiSender({ apiHost: 'myapi', apiPort: 6666 });

import { NexstarReceiver } from '../src/receivers/nexstar_receiver';
const receiver: NexstarReceiver = new NexstarReceiver({ sender: sender });

import { radec } from './test_data/radec';
import { azmalt } from './test_data/azmalt';
import { time } from './test_data/time';
import { location } from './test_data/location';
import { slew } from './test_data/slew';

const serverSettings: StellariumConnectroServerOptions = {
  receiver: receiver,
  port: 4444,
};
const socketClient: SocketClient = new SocketClient('127.0.0.1', 4444);
const server = new StellariumConnectroServer(serverSettings);

describe('StellariumConnectroServer', () => {
  describe('status - off', () => {
    test('get status value', async () => {
      expect(server.status()).toEqual(false);
    });
  });

  describe('status - on', () => {
    beforeAll(async () => {
      await server.start();
    });
    afterAll(async () => {
      await server.stop();
    });
    test('get status value', async () => {
      expect(server.status()).toEqual(true);
    });
  });

  describe('commands', () => {
    beforeAll(async () => {
      mockdate.set('2025-09-05T11:22:33Z');
      await server.start();
    });
    afterAll(async () => {
      await server.stop();
      mockdate.reset();
    });
    afterEach(() => {
      nock.cleanAll();
      nock.abortPendingRequests();
    });

    // =================================================================================================================
    // ===== get position commands  ====================================================================================
    // =================================================================================================================

    test('#getPreciseRaDec', async () => {
      nock('http://myapi:6666').get('/api/main/view').reply(200, radec.c1.apiRaw);
      const res: string = await socketClient.send('e');
      expect(res).toEqual(`${radec.c1.precise}#`);
    });
    test('#getBasicRaDec', async () => {
      nock('http://myapi:6666').get('/api/main/view').reply(200, radec.c2.apiRaw);
      const res: string = await socketClient.send('E');
      expect(res).toEqual(`${radec.c2.basic}#`);
    });
    test('#getPreciseAzmAlt', async () => {
      nock('http://myapi:6666').get('/api/main/view').reply(200, azmalt.c1.apiRaw);
      const res: string = await socketClient.send('z');
      expect(res).toEqual(`${azmalt.c1.precise}#`);
    });
    test('#getBasicAzmalt', async () => {
      nock('http://myapi:6666').get('/api/main/view').reply(200, azmalt.c2.apiRaw);
      const res: string = await socketClient.send('Z');
      expect(res).toEqual(`${azmalt.c2.basic}#`);
    });

    // =================================================================================================================
    // ===== goto commands =============================================================================================
    // =================================================================================================================

    test('#gotoPreciseRaDec', async () => {
      let capturedBody;
      nock('http://myapi:6666')
        .post('/api/main/view')
        .reply(200, (_uri, requestBody) => {
          capturedBody = requestBody;
          return 'OK';
        });
      const res: string = await socketClient.send(`r${radec.c1.precise}`);
      const apiRequestParams: number[] = coordinatesBodyToArray(capturedBody ?? '', 'j2000');
      expect(res).toEqual('#');
      expect(apiRequestParams[0]).toBeDefined();
      expect(roundToPrecision(apiRequestParams[0]!, 4)).toEqual(
        roundToPrecision(radec.c1.v3[0], 4),
      );
      expect(apiRequestParams[1]).toBeDefined();
      expect(roundToPrecision(apiRequestParams[1]!, 4)).toEqual(
        roundToPrecision(radec.c1.v3[1], 4),
      );
      expect(apiRequestParams[2]).toBeDefined();
      expect(roundToPrecision(apiRequestParams[2]!, 4)).toEqual(
        roundToPrecision(radec.c1.v3[2], 4),
      );
    });
    test('#gotoBasicRaDec', async () => {
      let capturedBody;
      nock('http://myapi:6666')
        .post('/api/main/view')
        .reply(200, (_uri, requestBody) => {
          capturedBody = requestBody;
          return 'OK';
        });
      const res: string = await socketClient.send(`R${radec.c2.basic}`);
      const apiRequestParams: number[] = coordinatesBodyToArray(capturedBody ?? '', 'j2000');
      expect(res).toEqual('#');
      expect(apiRequestParams[0]).toBeDefined();
      expect(roundToPrecision(apiRequestParams[0]!, 4)).toEqual(
        roundToPrecision(radec.c2.v3[0], 4),
      );
      expect(apiRequestParams[1]).toBeDefined();
      expect(roundToPrecision(apiRequestParams[1]!, 4)).toEqual(
        roundToPrecision(radec.c2.v3[1], 4),
      );
      expect(apiRequestParams[2]).toBeDefined();
      expect(roundToPrecision(apiRequestParams[2]!, 4)).toEqual(
        roundToPrecision(radec.c2.v3[2], 4),
      );
    });
    test('#gotoPreciseAzmAlt', async () => {
      let capturedBody;
      nock('http://myapi:6666')
        .post('/api/main/view')
        .reply(200, (_uri, requestBody) => {
          capturedBody = requestBody;
          return 'OK';
        });
      const res: string = await socketClient.send(`b${azmalt.c3.precise}`);
      const apiRequestParams: number[] = coordinatesBodyToArray(capturedBody ?? '', 'altAz');
      expect(res).toEqual('#');
      expect(apiRequestParams[0]).toBeDefined();
      expect(roundToPrecision(apiRequestParams[0]!, 4)).toEqual(
        roundToPrecision(azmalt.c3.v3[0], 4),
      );
      expect(apiRequestParams[1]).toBeDefined();
      expect(roundToPrecision(apiRequestParams[1]!, 4)).toEqual(
        roundToPrecision(azmalt.c3.v3[1], 4),
      );
      expect(apiRequestParams[2]).toBeDefined();
      expect(roundToPrecision(apiRequestParams[2]!, 4)).toEqual(
        roundToPrecision(azmalt.c3.v3[2], 4),
      );
    });
    test('#gotoBasicAzmAlt', async () => {
      let capturedBody;
      nock('http://myapi:6666')
        .post('/api/main/view')
        .reply(200, (_uri, requestBody) => {
          capturedBody = requestBody;
          return 'OK';
        });
      const res: string = await socketClient.send(`B${azmalt.c2.basic}`);
      const apiRequestParams: number[] = coordinatesBodyToArray(capturedBody ?? '', 'altAz');
      expect(res).toEqual('#');
      expect(apiRequestParams[0]).toBeDefined();
      expect(roundToPrecision(apiRequestParams[0]!, 4)).toEqual(
        roundToPrecision(azmalt.c2.v3[0], 4),
      );
      expect(apiRequestParams[1]).toBeDefined();
      expect(roundToPrecision(apiRequestParams[1]!, 4)).toEqual(
        roundToPrecision(azmalt.c2.v3[1], 4),
      );
      expect(apiRequestParams[2]).toBeDefined();
      expect(roundToPrecision(apiRequestParams[2]!, 4)).toEqual(
        roundToPrecision(azmalt.c2.v3[2], 4),
      );
    });

    // =================================================================================================================
    // ===== sync commands =============================================================================================
    // =================================================================================================================

    test('#syncPreciseRaDec', async () => {
      let capturedBody;
      nock('http://myapi:6666')
        .post('/api/main/view')
        .reply(200, (_uri, requestBody) => {
          capturedBody = requestBody;
          return 'OK';
        });
      const res: string = await socketClient.send(`s${radec.c1.precise}`);
      const apiRequestParams: number[] = coordinatesBodyToArray(capturedBody ?? '', 'j2000');
      expect(res).toEqual('#');
      expect(apiRequestParams[0]).toBeDefined();
      expect(roundToPrecision(apiRequestParams[0]!, 4)).toEqual(
        roundToPrecision(radec.c1.v3[0], 4),
      );
      expect(apiRequestParams[1]).toBeDefined();
      expect(roundToPrecision(apiRequestParams[1]!, 4)).toEqual(
        roundToPrecision(radec.c1.v3[1], 4),
      );
      expect(apiRequestParams[2]).toBeDefined();
      expect(roundToPrecision(apiRequestParams[2]!, 4)).toEqual(
        roundToPrecision(radec.c1.v3[2], 4),
      );
    });
    test('#syncBasicRaDec', async () => {
      let capturedBody;
      nock('http://myapi:6666')
        .post('/api/main/view')
        .reply(200, (_uri, requestBody) => {
          capturedBody = requestBody;
          return 'OK';
        });
      const res: string = await socketClient.send(`S${radec.c2.basic}`);
      const apiRequestParams: number[] = coordinatesBodyToArray(capturedBody ?? '', 'j2000');
      expect(res).toEqual('#');
      expect(apiRequestParams[0]).toBeDefined();
      expect(roundToPrecision(apiRequestParams[0]!, 4)).toEqual(
        roundToPrecision(radec.c2.v3[0], 4),
      );
      expect(apiRequestParams[1]).toBeDefined();
      expect(roundToPrecision(apiRequestParams[1]!, 4)).toEqual(
        roundToPrecision(radec.c2.v3[1], 4),
      );
      expect(apiRequestParams[2]).toBeDefined();
      expect(roundToPrecision(apiRequestParams[2]!, 4)).toEqual(
        roundToPrecision(radec.c2.v3[2], 4),
      );
    });

    // =================================================================================================================
    // ===== tracking commands =========================================================================================
    // =================================================================================================================

    test('#getTrackingMode', async () => {
      const res: string = await socketClient.send(asciiArrayToString([116]));
      expect(stringToAsciiArray(res)).toEqual([1, 35]);
    });
    test('#setTrackingMode', async () => {
      const res1: string = await socketClient.send(asciiArrayToString([84, 2]));
      const res2: string = await socketClient.send(asciiArrayToString([116]));
      expect(stringToAsciiArray(res1)).toEqual([35]);
      expect(stringToAsciiArray(res2)).toEqual([2, 35]);
    });

    // =================================================================================================================
    // ===== p - commands ==============================================================================================
    // =================================================================================================================

    describe('p-commands', () => {
      test('#pVariableRateAzmRaSlewPositive', async () => {
        let capturedBody;
        const rateHigh = 2;
        const rateLow = 88;
        nock('http://myapi:6666').get('/api/main/view').reply(200, slew.c1.apiRaw);
        nock('http://myapi:6666')
          .post('/api/main/view')
          .reply(200, (_uri, requestBody) => {
            capturedBody = requestBody;
            return 'OK';
          });
        const res: string = await socketClient.send(
          asciiArrayToString([80, 3, 16, 6, rateHigh, rateLow, 0, 0]),
        );
        const requestedCoords: number[] = coordinatesBodyToArray(capturedBody ?? '', 'j2000');
        expect(roundArrayToPrecision(requestedCoords, 6)).toEqual(
          roundArrayToPrecision(slew.c1.variable.AzmRa.Positive, 6),
        );
        expect(res).toEqual('#');
      });
      test('#pVariableRateAzmRaSlewNegative', async () => {
        let capturedBody;
        const rateHigh = 2;
        const rateLow = 88;
        nock('http://myapi:6666').get('/api/main/view').reply(200, slew.c1.apiRaw);
        nock('http://myapi:6666')
          .post('/api/main/view')
          .reply(200, (_uri, requestBody) => {
            capturedBody = requestBody;
            return 'OK';
          });
        const res: string = await socketClient.send(
          asciiArrayToString([80, 3, 16, 7, rateHigh, rateLow, 0, 0]),
        );
        const requestedCoords: number[] = coordinatesBodyToArray(capturedBody ?? '', 'j2000');
        expect(roundArrayToPrecision(requestedCoords, 6)).toEqual(
          roundArrayToPrecision(slew.c1.variable.AzmRa.Negative, 6),
        );
        expect(res).toEqual('#');
      });
      test('#pVariableRateAltDecSlewPositive', async () => {
        let capturedBody;
        const rateHigh = 2;
        const rateLow = 88;
        nock('http://myapi:6666').get('/api/main/view').reply(200, slew.c1.apiRaw);
        nock('http://myapi:6666')
          .post('/api/main/view')
          .reply(200, (_uri, requestBody) => {
            capturedBody = requestBody;
            return 'OK';
          });
        const res: string = await socketClient.send(
          asciiArrayToString([80, 3, 17, 6, rateHigh, rateLow, 0, 0]),
        );
        const requestedCoords: number[] = coordinatesBodyToArray(capturedBody ?? '', 'j2000');
        expect(roundArrayToPrecision(requestedCoords, 6)).toEqual(
          roundArrayToPrecision(slew.c1.variable.AltDec.Positive, 6),
        );
        expect(res).toEqual('#');
      });
      test('#pVariableRateAltDecSlewNegative', async () => {
        let capturedBody;
        const rateHigh = 2;
        const rateLow = 88;
        nock('http://myapi:6666').get('/api/main/view').reply(200, slew.c1.apiRaw);
        nock('http://myapi:6666')
          .post('/api/main/view')
          .reply(200, (_uri, requestBody) => {
            capturedBody = requestBody;
            return 'OK';
          });
        const res: string = await socketClient.send(
          asciiArrayToString([80, 3, 17, 7, rateHigh, rateLow, 0, 0]),
        );
        const requestedCoords: number[] = coordinatesBodyToArray(capturedBody ?? '', 'j2000');
        expect(roundArrayToPrecision(requestedCoords, 6)).toEqual(
          roundArrayToPrecision(slew.c1.variable.AltDec.Negative, 6),
        );
        expect(res).toEqual('#');
      });

      // ======================================================

      test('#pFixedRateAzmRaSlewPositive', async () => {
        let capturedBody;
        const selectedSpeed = 5;
        nock('http://myapi:6666').get('/api/main/view').reply(200, slew.c1.apiRaw);
        nock('http://myapi:6666')
          .post('/api/main/view')
          .reply(200, (_uri, requestBody) => {
            capturedBody = requestBody;
            return 'OK';
          });
        const res: string = await socketClient.send(
          asciiArrayToString([80, 2, 16, 36, selectedSpeed, 0, 0, 0]),
        );
        const requestedCoords: number[] = coordinatesBodyToArray(capturedBody ?? '', 'j2000');
        expect(roundArrayToPrecision(requestedCoords, 6)).toEqual(
          roundArrayToPrecision(slew.c1.fixed.AzmRa.Positive, 6),
        );
        expect(res).toEqual('#');
      });
      test('#pFixedRateAzmRaSlewNegative', async () => {
        let capturedBody;
        const selectedSpeed = 5;
        nock('http://myapi:6666').get('/api/main/view').reply(200, slew.c1.apiRaw);
        nock('http://myapi:6666')
          .post('/api/main/view')
          .reply(200, (_uri, requestBody) => {
            capturedBody = requestBody;
            return 'OK';
          });
        const res: string = await socketClient.send(
          asciiArrayToString([80, 2, 16, 37, selectedSpeed, 0, 0, 0]),
        );
        const requestedCoords: number[] = coordinatesBodyToArray(capturedBody ?? '', 'j2000');
        expect(roundArrayToPrecision(requestedCoords, 6)).toEqual(
          roundArrayToPrecision(slew.c1.fixed.AzmRa.Negative, 6),
        );
        expect(res).toEqual('#');
      });
      test('#pFixedRateAltDecSlewPositive', async () => {
        let capturedBody;
        const selectedSpeed = 5;
        nock('http://myapi:6666').get('/api/main/view').reply(200, slew.c1.apiRaw);
        nock('http://myapi:6666')
          .post('/api/main/view')
          .reply(200, (_uri, requestBody) => {
            capturedBody = requestBody;
            return 'OK';
          });
        const res: string = await socketClient.send(
          asciiArrayToString([80, 2, 17, 36, selectedSpeed, 0, 0, 0]),
        );
        const requestedCoords: number[] = coordinatesBodyToArray(capturedBody ?? '', 'j2000');
        expect(roundArrayToPrecision(requestedCoords, 6)).toEqual(
          roundArrayToPrecision(slew.c1.fixed.AltDec.Positive, 6),
        );
        expect(res).toEqual('#');
      });
      test('#pFixedRateAltDecSlewNegative', async () => {
        let capturedBody;
        const selectedSpeed = 5;
        nock('http://myapi:6666').get('/api/main/view').reply(200, slew.c1.apiRaw);
        nock('http://myapi:6666')
          .post('/api/main/view')
          .reply(200, (_uri, requestBody) => {
            capturedBody = requestBody;
            return 'OK';
          });
        const res: string = await socketClient.send(
          asciiArrayToString([80, 2, 17, 37, selectedSpeed, 0, 0, 0]),
        );
        const requestedCoords: number[] = coordinatesBodyToArray(capturedBody ?? '', 'j2000');
        expect(roundArrayToPrecision(requestedCoords, 6)).toEqual(
          roundArrayToPrecision(slew.c1.fixed.AltDec.Negative, 6),
        );
        expect(res).toEqual('#');
      });
      // ======================================================
      test('#pGetDate', async () => {
        const resGps: string = await socketClient.send(
          asciiArrayToString([80, 1, 176, 3, 0, 0, 0, 2]),
        );
        const resRtc: string = await socketClient.send(
          asciiArrayToString([80, 1, 178, 3, 0, 0, 0, 2]),
        );
        expect(stringToAsciiArray(resGps)).toEqual([9, 5, 35]);
        expect(stringToAsciiArray(resRtc)).toEqual([9, 5, 35]);
      });
      test('#pGetYear', async () => {
        const resGps: string = await socketClient.send(
          asciiArrayToString([80, 1, 176, 4, 0, 0, 0, 2]),
        );
        const resRtc: string = await socketClient.send(
          asciiArrayToString([80, 1, 178, 4, 0, 0, 0, 2]),
        );
        expect(stringToAsciiArray(resGps)).toEqual([7, 233, 35]);
        expect(stringToAsciiArray(resRtc)).toEqual([7, 233, 35]);
      });
      test('#pGetTime', async () => {
        const resGps: string = await socketClient.send(
          asciiArrayToString([80, 1, 176, 51, 0, 0, 0, 3]),
        );
        const resRtc: string = await socketClient.send(
          asciiArrayToString([80, 1, 178, 51, 0, 0, 0, 3]),
        );
        expect(stringToAsciiArray(resGps)).toEqual([13, 22, 33, 35]);
        expect(stringToAsciiArray(resRtc)).toEqual([13, 22, 33, 35]);
      });
      // ======================================================
      test('#pIsGpsLinked', async () => {
        const res: string = await socketClient.send(
          asciiArrayToString([80, 1, 176, 55, 0, 0, 0, 1]),
        );
        expect(stringToAsciiArray(res)).toEqual([NexstarReceiver.DEFAULT_IS_GPS_LINKED, 35]);
      });
      test('#pGpsGetLatitude', async () => {
        nock('http://myapi:6666').get('/api/main/status').reply(200, location.l1.apiFull);
        const res: string = await socketClient.send(
          asciiArrayToString([80, 1, 176, 1, 0, 0, 0, 3]),
        );
        expect(stringToAsciiArray(res)).toEqual(location.l1.xyzArr.latitude);
      });
      test('#pGpsGetLongitude', async () => {
        nock('http://myapi:6666').get('/api/main/status').reply(200, location.l1.apiFull);
        const res: string = await socketClient.send(
          asciiArrayToString([80, 1, 176, 2, 0, 0, 0, 3]),
        );
        expect(stringToAsciiArray(res)).toEqual(location.l1.xyzArr.longitude);
      });
      // ======================================================
      test('#pRtcSetDate', async () => {
        const res: string = await socketClient.send(
          asciiArrayToString([80, 3, 178, 131, 10, 20, 0, 0]),
        );
        expect(res).toEqual('#');
      });
      test('#pRtcSetYear', async () => {
        const res: string = await socketClient.send(
          asciiArrayToString([80, 3, 178, 132, 10, 20, 0, 0]),
        );
        expect(res).toEqual('#');
      });
      test('#pRtcSetTime', async () => {
        const res: string = await socketClient.send(
          asciiArrayToString([80, 4, 178, 179, 10, 20, 30, 0]),
        );
        expect(res).toEqual('#');
      });
      // ======================================================
      test('#pGetDeviceVersion AZM/RA motor', async () => {
        const res: string = await socketClient.send(
          asciiArrayToString([80, 1, 16, 254, 0, 0, 0, 22]),
        );
        expect(stringToAsciiArray(res)).toEqual([
          ...NexstarReceiver.DEFAULT_AZM_RA_MOTOR_VERSION,
          35,
        ]);
      });
      test('#pGetDeviceVersion ALT/DEC motor', async () => {
        const res: string = await socketClient.send(
          asciiArrayToString([80, 1, 17, 254, 0, 0, 0, 22]),
        );
        expect(stringToAsciiArray(res)).toEqual([
          ...NexstarReceiver.DEFAULT_ALT_DEC_MOTOR_VERSION,
          35,
        ]);
      });
      test('#pGetDeviceVersion GPS', async () => {
        const res: string = await socketClient.send(
          asciiArrayToString([80, 1, 176, 254, 0, 0, 0, 22]),
        );
        expect(stringToAsciiArray(res)).toEqual([...NexstarReceiver.DEFAULT_GPS_VERSION, 35]);
      });
      test('#pGetDeviceVersion RTC', async () => {
        const res: string = await socketClient.send(
          asciiArrayToString([80, 1, 178, 254, 0, 0, 0, 22]),
        );
        expect(stringToAsciiArray(res)).toEqual([...NexstarReceiver.DEFAULT_RTC_VERSION, 35]);
      });
    });

    // =================================================================================================================
    // ===== time and location commands ================================================================================
    // =================================================================================================================

    test('#getLocation', async () => {
      nock('http://myapi:6666').get('/api/main/status').reply(200, location.l1.apiFull);
      const res: string = await socketClient.send('w');
      expect(res).toEqual(`${location.l1.nexstarString}#`);
    });
    test('#setLocation', async () => {
      let capturedBody;
      nock('http://myapi:6666')
        .post('/api/location/setlocationfields')
        .reply(200, (_uri, requestBody) => {
          capturedBody = requestBody;
          return 'OK';
        });
      const res: string = await socketClient.send(`W${location.l2.nexstarString}`);
      const requestedLatitude: number = coordinatesBodyToNumber(capturedBody ?? '', 'latitude');
      const requestedLongitude: number = coordinatesBodyToNumber(capturedBody ?? '', 'longitude');
      expect(res).toEqual('#');
      expect(roundToPrecision(requestedLatitude, 3)).toEqual(
        roundToPrecision(location.l2.decimal.latitude, 3),
      );
      expect(roundToPrecision(requestedLongitude, 3)).toEqual(
        roundToPrecision(location.l2.decimal.longitude, 3),
      );
    });
    test('#getTime', async () => {
      nock('http://myapi:6666').get('/api/main/status').reply(200, time.t1.apiFull);
      const res: string = await socketClient.send('h');
      expect(res).toEqual(`${time.t1.nexstarString}#`);
    });
    test('#setTime', async () => {
      let capturedBody;
      nock('http://myapi:6666')
        .post('/api/main/time')
        .reply(200, (_uri, requestBody) => {
          capturedBody = requestBody;
          return 'OK';
        });
      const res: string = await socketClient.send(`H${time.t2.nexstarString}`);
      const requestedtime: number = coordinatesBodyToNumber(capturedBody ?? '', 'time');
      expect(res).toEqual('#');
      expect(requestedtime).toEqual(time.t2.julian);
    });

    // =================================================================================================================
    // ===== misc commands =============================================================================================
    // =================================================================================================================

    test('#getVersion', async () => {
      const res: string = await socketClient.send('V');
      expect(res).toEqual(asciiArrayToString([4, 10, 35]));
    });
    test('#getModel', async () => {
      const res: string = await socketClient.send('m');
      expect(res).toEqual(asciiArrayToString([12, 35]));
    });
    test('#echo', async () => {
      const res: string = await socketClient.send('Kx');
      expect(res).toEqual('x#');
    });
    test('#isAlignmentComplete', async () => {
      const res: string = await socketClient.send('J');
      expect(res).toEqual(asciiArrayToString([1, 35]));
    });
    test('#isGotoInProcess', async () => {
      const res: string = await socketClient.send('L');
      expect(res).toEqual(asciiArrayToString([48, 35]));
    });
    test('#cancelGoto', async () => {
      const res: string = await socketClient.send('M');
      expect(res).toEqual(asciiArrayToString([35]));
    });
  });
});
