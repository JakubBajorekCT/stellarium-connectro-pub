import { BaseSender } from '../../src/senders/base_sender.ts';

describe('BaseSender', () => {
  const baseSender: BaseSender = new BaseSender();

  describe('#getViewCoordinates', () => {
    test('must be implemented', async () => {
      await expect(baseSender.getViewCoordinates()).rejects.toThrow();
    });
  });
  describe('#getTime', () => {
    test('must be implemented', async () => {
      await expect(baseSender.getTime()).rejects.toThrow();
    });
  });
  describe('#setTime', () => {
    test('must be implemented', async () => {
      await expect(baseSender.setTime(123)).rejects.toThrow();
    });
  });
  describe('#getLocation', () => {
    test('must be implemented', async () => {
      await expect(baseSender.getLocation()).rejects.toThrow();
    });
  });
  describe('#setLocation', () => {
    test('must be implemented', async () => {
      await expect(baseSender.setLocation(10)).rejects.toThrow();
    });
  });
  describe('#setViewCoordinates', () => {
    test('must be implemented', async () => {
      await expect(baseSender.setViewCoordinates([1, 2, 3], 'a')).rejects.toThrow();
    });
  });
  describe('#moveView', () => {
    test('must be implemented', async () => {
      await expect(baseSender.moveView(1, 2)).rejects.toThrow();
    });
  });
});
