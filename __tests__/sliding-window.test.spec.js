import { SlidingWindow } from '../src/sliding-window';

describe('SlidingWindow', () => {
  let slidingWindow;
  describe('intial cursor', () => {
    beforeAll(() => {
      slidingWindow = new SlidingWindow('aaba');
    });

    it('has the correct lookAhead contents', () => {
      expect(slidingWindow.lookAhead()).toEqual('aaba');
    });

    it('has the correct lookBack contents', () => {
      expect(slidingWindow.lookBack()).toEqual('');
    });
  });

  describe('slide 2', () => {
    beforeAll(() => {
      slidingWindow = new SlidingWindow('aaba');
      slidingWindow.slideBy(2);
    });

    it('has the correct lookAhead contents', () => {
      expect(slidingWindow.lookAhead()).toEqual('ba');
    });

    it('has the correct lookBack contents', () => {
      expect(slidingWindow.lookBack()).toEqual('aa');
    });
  });

  describe('slide callback 2', () => {
    beforeAll(() => {
      slidingWindow = new SlidingWindow('aaba');
      slidingWindow.slide((lookAhead, lookBack, lookbackLength) => {
        prefix: [0, 0];
      });
    });

    it('has the correct lookAhead contents', () => {
      expect(slidingWindow.lookAhead()).toEqual('aba');
    });

    it('has the correct lookBack contents', () => {
      expect(slidingWindow.lookBack()).toEqual('a');
    });
  });
});
