import { TimeConverter } from '../../src/converters/time_converter';
import { stringToAsciiArray } from '../../src/shared_helpers';

import { time } from '../test_data/time';

describe('TimeConverter', () => {
  const time1converter: TimeConverter = TimeConverter.fromApiSender(time.t1.api);
  const time2converter: TimeConverter = TimeConverter.fromNexstar(
    stringToAsciiArray(`H${time.t2.nexstarString}`),
  );

  describe('conversions', () => {
    test('for time1 nexstar format', async () => {
      expect(time1converter.asNexstar()).toEqual(time.t1.nexstarNumber);
    });
    test('for time1 iso format', async () => {
      expect(time1converter.asIso()).toEqual(time.t1.iso);
    });
    test('for time2 nexstar format', async () => {
      expect(time2converter.asNexstar()).toEqual(time.t2.nexstarNumber);
    });
    test('for time2 iso format', async () => {
      expect(time2converter.asIso()).toEqual(time.t2.iso);
    });
  });
});
