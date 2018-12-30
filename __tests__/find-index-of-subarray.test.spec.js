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
      expect(findIndexOfSubarray(Buffer.from([]))).toEqual(-1);
    });
  });

  describe('and a length=1 searchArray arg is provided', () => {
    const searchArray = Buffer.from([6]);
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
        expect(findIndexOfSubarray(searchArray, Buffer.from([1]))).toEqual(-1);
      });
    });

    describe('and a length=1, matching subarray arg is provided', () => {
      it('returns index', () => {
        expect(findIndexOfSubarray(searchArray, Buffer.from([6]))).toEqual(0);
      });
    });
  });

  describe('and a length=4 searchArray arg is provided', () => {
    const searchArray = Buffer.from([6, 'b', 9, '$']);

    describe('and a length=1, matching subarray arg is provided', () => {
      it('returns index', () => {
        expect(findIndexOfSubarray(searchArray, Buffer.from([9]))).toEqual(1);
      });
    });

    describe('and a length=2, matching subarray arg is provided', () => {
      it('returns index', () => {
        expect(findIndexOfSubarray(searchArray, Buffer.from(['b', 9]))).toEqual(
          1
        );
      });
    });

    describe('and a length=3, matching subarray arg is provided', () => {
      it('returns index', () => {
        expect(findIndexOfSubarray(searchArray, Buffer.from([6, 'b']))).toEqual(
          2
        );
      });
    });

    describe('and a length=4, matching subarray arg is provided', () => {
      it('returns index', () => {
        expect(findIndexOfSubarray(searchArray, Buffer.from([6, 'b', 9, '$']))).toEqual(
          0
        );
      });
    });

    describe('and a length=1, partially matching subarray arg is provided', () => {
      it('returns -1', () => {
        expect(
          findIndexOfSubarray(searchArray, Buffer.from(['b', 12]))
        ).toEqual(-1);
      });
    });
  });

  describe('and a length=7 searchArray arg with duplicate matches is provided', () => {
    const searchArray = Buffer.from([6, 'b', 9, '$', 'b', 9, '$']);

    describe('and a length=2, matching subarray arg is provided', () => {
      it('returns index', () => {
        expect(findIndexOfSubarray(searchArray, Buffer.from([9, '$']))).toEqual(
          0
        );
      });
    });
  });
});
