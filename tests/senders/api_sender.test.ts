import nock from 'nock';
import { type ApiSenderOptions, ApiSender } from '../../src/senders/api_sender';
import type {
  StellariumView,
  StellariumStatusTime,
  StellariumStatusLocation,
} from '../../src/types/stellarium';

import { viewData1, viewData1Raw, statusData1 } from '../test_data/api_responses';
import { location } from '../test_data/location';
import { coordinatesBodyToArray, coordinatesBodyToNumber } from '../test_helpers';

const apiSenderOpts: ApiSenderOptions = {
  apiHost: 'myhost',
  apiPort: 5555,
};

describe('ApiSender', () => {
  const apiSender: ApiSender = new ApiSender(apiSenderOpts);

  describe('#getViewCoordinates', () => {
    beforeAll(async () => {
      nock('http://myhost:5555').get('/api/main/view').reply(200, viewData1Raw);
    });
    test('for viewData1', async () => {
      const res: StellariumView = await apiSender.getViewCoordinates();
      expect(res).toEqual(viewData1);
    });
  });

  describe('#setViewCoordinates', () => {
    test('for viewData1', async () => {
      let capturedBody;
      nock('http://myhost:5555')
        .post('/api/main/view')
        .reply(200, (_uri, requestBody) => {
          capturedBody = requestBody;
          return 'OK';
        });
      const res: boolean = await apiSender.setViewCoordinates(viewData1.j2000, 'j2000');
      const requestedView: number[] = coordinatesBodyToArray(capturedBody ?? '', 'j2000');
      expect(res).toEqual(true);
      expect(requestedView).toEqual(viewData1.j2000);
    });
  });

  describe('#getTime', () => {
    beforeAll(async () => {
      nock('http://myhost:5555').get('/api/main/status').reply(200, statusData1);
    });
    test('for statusData1', async () => {
      const res: StellariumStatusTime = await apiSender.getTime();
      expect(res).toEqual(statusData1.time);
    });
  });

  describe('#setTime', () => {
    test('for timeData1', async () => {
      let capturedBody;
      nock('http://myhost:5555')
        .post('/api/main/time')
        .reply(200, (_uri, requestBody) => {
          capturedBody = requestBody;
          return 'OK';
        });
      const res: boolean = await apiSender.setTime(statusData1.time.jday);
      const requestedTime: number = coordinatesBodyToNumber(capturedBody ?? '', 'time');
      expect(res).toEqual(true);
      expect(requestedTime).toEqual(statusData1.time.jday);
    });
  });

  describe('#getlocation', () => {
    beforeAll(async () => {
      nock('http://myhost:5555').get('/api/main/status').reply(200, statusData1);
    });
    afterEach(() => {
      nock.cleanAll();
      nock.abortPendingRequests();
    });
    test('for statusData1', async () => {
      const res: StellariumStatusLocation = await apiSender.getLocation();
      expect(res).toEqual(statusData1.location);
    });
  });

  describe('#setlocation', () => {
    test('for locationData2', async () => {
      let capturedBody;
      nock('http://myhost:5555')
        .post('/api/location/setlocationfields')
        .reply(200, (_uri, requestBody) => {
          capturedBody = requestBody;
          return 'OK';
        });
      const res: boolean = await apiSender.setLocation(location.l2.decimal);
      const requestedLatitude: number = coordinatesBodyToNumber(capturedBody ?? '', 'latitude');
      const requestedLongitude: number = coordinatesBodyToNumber(capturedBody ?? '', 'longitude');
      expect(res).toEqual(true);
      expect(requestedLatitude).toEqual(location.l2.decimal.latitude);
      expect(requestedLongitude).toEqual(location.l2.decimal.longitude);
    });
  });

  describe('#moveView', () => {
    test('for moveView data1', async () => {
      let capturedBody;
      const x = 12;
      const y = -4;
      nock('http://myhost:5555')
        .post('/api/main/move')
        .reply(200, (_uri, requestBody) => {
          capturedBody = requestBody;
          return 'OK';
        });
      const res: boolean = await apiSender.moveView(x, y);
      const requestedX: number = coordinatesBodyToNumber(capturedBody ?? '', 'x');
      const requestedY: number = coordinatesBodyToNumber(capturedBody ?? '', 'y');
      expect(res).toEqual(true);
      expect(requestedX).toEqual(x);
      expect(requestedY).toEqual(y);
    });
  });
});
