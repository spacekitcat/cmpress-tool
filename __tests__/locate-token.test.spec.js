import locateToken from '../src/locate-token.js';

describe('locatet()', () => {
  describe('No arguments are provided', () => {
    it('returns undefined', () => {
      expect(locateToken()).toEqual({
        t: undefined
      });
    });
  });

  describe('Both arguments are null', () => {
    it('returns undefined', () => {
      expect(locateToken(null, null)).toEqual({
        t: undefined
      });
    });
  });

  describe('The history buffer is null', () => {
    const dictionaryValue = null;
    describe('The input buffer is not provided', () => {
      it('returns undefined', () => {
        expect(locateToken(dictionaryValue)).toEqual({
          t: undefined
        });
      });
    });

    describe('The input buffer is an empty string', () => {
      it('returns undefined', () => {
        expect(locateToken(dictionaryValue, Buffer.from([]))).toEqual({
          t: undefined
        });
      });
    });

    describe('The input buffer is a string of length three', () => {
      it('returns the next character from the input buffer', () => {
        expect(
          locateToken(dictionaryValue, Buffer.from([120, 121, 122]))
        ).toEqual({
          t: Buffer.from([120])
        });
      });
    });
  });

  describe('The history buffer is empty', () => {
    const dictionaryValue = Buffer.from([]);
    describe('The input buffer is not provided', () => {
      it('returns undefined', () => {
        expect(locateToken(dictionaryValue)).toEqual({
          t: undefined
        });
      });
    });

    describe('The input buffer is an empty string', () => {
      it('returns undefined', () => {
        expect(locateToken(dictionaryValue, Buffer.from([]))).toEqual({
          t: undefined
        });
      });
    });

    describe('The input buffer is a string of length three', () => {
      it('returns the next character from the input buffer', () => {
        expect(
          locateToken(dictionaryValue, Buffer.from([120, 121, 123]))
        ).toEqual({
          t: Buffer.from([120])
        });
      });
    });
  });

  describe('The history buffer has a length of 3', () => {
    const dictionaryValue = Buffer.from([78, 79, 80]);
    describe('The input buffer is not provided', () => {
      it('returns undefined', () => {
        expect(locateToken(dictionaryValue)).toEqual({
          t: undefined
        });
      });
    });

    describe('The input buffer is an empty array', () => {
      it('returns undefined', () => {
        expect(locateToken(dictionaryValue, Buffer.from([]))).toEqual({
          t: undefined
        });
      });
    });

    describe('The input buffer contains characters which are not in the history buffer', () => {
      it('returns the next character from the input buffer', () => {
        expect(locateToken(dictionaryValue, Buffer.from([97, 98, 99]))).toEqual(
          {
            t: Buffer.from([97])
          }
        );
      });
    });

    describe('The input buffer contains characters which are in the histroy buffer', () => {
      it('returns the next character from the input buffer', () => {
        expect(locateToken(dictionaryValue, Buffer.from([79, 80, 79]))).toEqual(
          {
            t: Buffer.from([79]),
            p: [1, 2]
          }
        );
      });
    });
  });

  describe('The history buffer has a length of 10', () => {
    const dictionaryValue = Buffer.from([
      78,
      79,
      80,
      81,
      82,
      83,
      84,
      85,
      86,
      87
    ]);

    describe('The input buffer contains characters which are not in the history buffer', () => {
      it('returns the next character from the input buffer', () => {
        expect(locateToken(dictionaryValue, Buffer.from([97, 98, 99]))).toEqual(
          {
            t: Buffer.from([97])
          }
        );
      });
    });

    describe('The input buffer contains characters which are in the histroy buffer', () => {
      it('returns the match as a p', () => {
        expect(
          locateToken(
            dictionaryValue,
            Buffer.from([80, 81, 82, 83, 84, 85, 100])
          )
        ).toEqual({
          p: [3, 6],
          t: Buffer.from([100])
        });
      });
    });
  });
});
