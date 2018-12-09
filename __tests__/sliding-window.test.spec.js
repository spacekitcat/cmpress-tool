import { SlidingWindow } from '../src/sliding-window';

describe('SlidingWindow', () => {
  let inputStream = [97, 97, 98, 97];

  let slidingWindow;
  describe('intial cursor', () => {
    beforeAll(() => {
      slidingWindow = new SlidingWindow(4, 4);
      slidingWindow.setInput(inputStream);
    });

    it('has the correct lookAhead contents', () => {
      expect(slidingWindow.lookAhead()).toMatchObject(Buffer.from('aaba'));
    });

    it('has the correct lookBack contents', () => {
      expect(slidingWindow.lookBack()).toEqual(Buffer.from(''));
    });
  });

  describe('slide 2', () => {
    beforeAll(() => {
      slidingWindow = new SlidingWindow(4, 4);
      slidingWindow.setInput(inputStream);
      slidingWindow.slideBy(2);
    });

    it('has the correct lookAhead contents', () => {
      expect(slidingWindow.lookAhead()).toEqual(Buffer.from('ba'));
    });

    it('has the correct lookBack contents', () => {
      expect(slidingWindow.lookBack()).toEqual(Buffer.from('aa'));
    });
  });

  describe('slide callback 2', () => {
    beforeAll(() => {
      slidingWindow = new SlidingWindow(4, 4);
      slidingWindow.setInput(inputStream);
      slidingWindow.slide((lookAhead, lookbackLength) => ({
        prefix: [0, 0]
      }));
    });

    it('has the correct lookAhead contents', () => {
      expect(slidingWindow.lookAhead()).toEqual(Buffer.from('aba'));
    });

    it('has the correct lookBack contents', () => {
      expect(slidingWindow.lookBack()).toEqual(Buffer.from('a'));
    });
  });
});
