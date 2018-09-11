import reverseString from '../src/reverse-string';

describe('The reverseString function', () => {
  describe('The input string is undefined', () => {
    it('should return an empty string', () => {
      expect(reverseString()).toEqual('');
    });
  });

  describe('The input string is null', () => {
    it('should return an empty string', () => {
      expect(reverseString(null)).toEqual('');
    });
  });

  describe('The input string is an empty string', () => {
    it('should return an empty string', () => {
      expect(reverseString('')).toEqual('');
    });
  });

  describe('The input string is a string with a length >0', () => {
    it('should return the reversed string', () => {
      expect(reverseString('abc')).toEqual('cba');
    });
  });
});
