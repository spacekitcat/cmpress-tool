import findIndexOfSubarray from '../src/find-index-of-subarray';

describe('findIndexOfSubarray', () => {
  describe('and no args are provided', () => {
    it('returns -1', () => {
      expect(findIndexOfSubarray()).toEqual(-1);
    });
  });

  describe('and a `null` searchArray arg is provided', () => {
    it('returns -1', () => {
      expect(findIndexOfSubarray(null)).toEqual(-1);
    });
  });

  describe('and a empty searchArray arg is provided', () => {
    it('returns -1', () => {
      expect(findIndexOfSubarray([])).toEqual(-1);
    });
  });

  describe('and a length=1 searchArray arg is provided', () => {
    const searchArray = [6];
    describe('and no subarray arg is provided', () => {
      it('returns -1', () => {
        expect(findIndexOfSubarray(searchArray)).toEqual(-1);
      });
    });

    describe('and a null subarray arg is provided', () => {
      it('returns -1', () => {
        expect(findIndexOfSubarray(searchArray, null)).toEqual(-1);
      });
    });

    describe('and an empty subarray arg is provided', () => {
      it('returns -1', () => {
        expect(findIndexOfSubarray(searchArray, [])).toEqual(-1);
      });
    });

    describe('and a length=1, non-matching subarray arg is provided', () => {
      it('returns -1', () => {
        expect(findIndexOfSubarray(searchArray, [1])).toEqual(-1);
      });
    });

    describe('and a length=1, matching subarray arg is provided', () => {
      it('returns index', () => {
        expect(findIndexOfSubarray(searchArray, [6])).toEqual(0);
      });
    });
  });

  describe('and a length=4 searchArray arg is provided', () => {
    const searchArray = [6, 'b', 9, '$'];
    describe('and a length=1, matching subarray arg is provided', () => {
      it('returns index', () => {
        expect(findIndexOfSubarray(searchArray, [9])).toEqual(2);
      });
    });

    describe('and a length=2, matching subarray arg is provided', () => {
      it('returns index', () => {
        expect(findIndexOfSubarray(searchArray, ['b', 9])).toEqual(1);
      });
    });

    describe('and a length=1, partially matching subarray arg is provided', () => {
      it('returns -1', () => {
        expect(findIndexOfSubarray(searchArray, ['b', 12])).toEqual(-1);
      });
    });
  });

  describe('and a length=6 searchArray arg with duplicate matches is provided', () => {
    const searchArray = [6, 'b', 9, '$', 'b', '9'];

    describe('and a length=2, matching subarray arg is provided', () => {
      it('returns index', () => {
        expect(findIndexOfSubarray(searchArray, [9, '$'])).toEqual(2);
      });
    });
  });
});
