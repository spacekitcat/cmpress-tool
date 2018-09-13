import locateToken from '../src/locate-token';

describe('locateToken()', () => {
  describe('No arguments are provided', () => {
    it('returns undefined', () => {
      expect(locateToken()).toEqual({
        prefix: undefined,
        token: undefined
      });
    });
  });

  describe('Both arguments are null', () => {
    it('returns undefined', () => {
      expect(locateToken(null, null)).toEqual({
        prefix: undefined,
        token: undefined
      });
    });
  });

  describe('The history buffer is null', () => {
    const dictionaryValue = null;
    describe('The input buffer is not provided', () => {
      it('returns undefined', () => {
        expect(locateToken(dictionaryValue)).toEqual({
          prefix: undefined,
          token: undefined
        });
      });
    });

    describe('The input buffer is an empty string', () => {
      it('returns undefined', () => {
        expect(locateToken(dictionaryValue, '')).toEqual({
          prefix: undefined,
          token: undefined
        });
      });
    });

    describe('The input buffer is a string of length three', () => {
      it('returns the next character from the input buffer', () => {
        expect(locateToken(dictionaryValue, 'xyz')).toEqual({
          prefix: undefined,
          token: 'x'
        });
      });
    });
  });

  describe('The history buffer is empty', () => {
    const dictionaryValue = '';
    describe('The input buffer is not provided', () => {
      it('returns undefined', () => {
        expect(locateToken(dictionaryValue)).toEqual({
          prefix: undefined,
          token: undefined
        });
      });
    });

    describe('The input buffer is an empty string', () => {
      it('returns undefined', () => {
        expect(locateToken(dictionaryValue, '')).toEqual({
          prefix: undefined,
          token: undefined
        });
      });
    });

    describe('The input buffer is a string of length three', () => {
      it('returns the next character from the input buffer', () => {
        expect(locateToken(dictionaryValue, 'xyz')).toEqual({
          prefix: undefined,
          token: 'x'
        });
      });
    });
  });

  describe('The history buffer has a length of 3', () => {
    const dictionaryValue = 'xyz';
    describe('The input buffer is not provided', () => {
      it('returns undefined', () => {
        expect(locateToken(dictionaryValue)).toEqual({
          prefix: undefined,
          token: undefined
        });
      });
    });

    describe('The input buffer is an empty string', () => {
      it('returns undefined', () => {
        expect(locateToken(dictionaryValue, '')).toEqual({
          prefix: undefined,
          token: undefined
        });
      });
    });

    describe('The input buffer contains characters which are not in the history buffer', () => {
      it('returns the next character from the input buffer', () => {
        expect(locateToken(dictionaryValue, 'abc')).toEqual({
          prefix: undefined,
          token: 'a'
        });
      });
    });

    describe('The input buffer contains characters which are not in the histroy buffer', () => {
      it('returns the next character from the input buffer', () => {
        expect(locateToken(dictionaryValue, 'yza')).toEqual({
          prefix: [1, 2],
          token: 'a'
        });
      });
    });
  });
});
