import { SlidingWindow } from '../src/sliding-window';

describe('SlidingWindow', () => {
  let inputStream = {
    read: n => ['a', 'a', 'b', 'a']
  };
  let slidingWindow;
  describe('intial cursor', () => {
    beforeAll(() => {
      slidingWindow = new SlidingWindow(
        ['a', 'a', 'b', 'a'],
        4,
        4,
        inputStream
      );
    });

    it('has the correct lookAhead contents', () => {
      expect(slidingWindow.lookAhead()).toEqual(['a', 'a', 'b', 'a']);
    });

    it('has the correct lookBack contents', () => {
      expect(slidingWindow.lookBack()).toEqual([]);
    });
  });

  describe('slide 2', () => {
    beforeAll(() => {
      slidingWindow = new SlidingWindow(
        ['a', 'a', 'b', 'a'],
        4,
        4,
        inputStream
      );
      slidingWindow.slideBy(2);
    });

    it('has the correct lookAhead contents', () => {
      expect(slidingWindow.lookAhead()).toEqual(['b', 'a']);
    });

    it('has the correct lookBack contents', () => {
      expect(slidingWindow.lookBack()).toEqual(['a', 'a']);
    });
  });

  describe('slide callback 2', () => {
    beforeAll(() => {
      slidingWindow = new SlidingWindow(
        ['a', 'a', 'b', 'a'],
        4,
        4,
        inputStream
      );
      slidingWindow.slide((lookAhead, lookbackLength) => ({
        prefix: [0, 0]
      }));
    });

    it('has the correct lookAhead contents', () => {
      expect(slidingWindow.lookAhead()).toEqual(['a', 'b', 'a']);
    });

    it('has the correct lookBack contents', () => {
      expect(slidingWindow.lookBack()).toEqual(['a']);
    });
  });
});
