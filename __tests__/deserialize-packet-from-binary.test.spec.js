import deserializePacketFromBinary from '../src/deserialize-packet-from-binary';

describe('deserializePacketFromBinary', () => {
  let result;
  let argument;

  describe('when the input is a blank string', () => {
    it('should throw an Error', () => {
      expect(() => deserializePacketFromBinary('')).toThrowError(
        'Invalid compression serialisation stream format'
      );
    });
  });

  describe('when the input is undefined', () => {
    it('should throw an Error', () => {
      expect(() => deserializePacketFromBinary(undefined)).toThrowError(
        'Invalid compression serialisation stream format'
      );
    });
  });

  describe('when the input is null', () => {
    it('should throw an Error', () => {
      expect(() => deserializePacketFromBinary(undefined)).toThrowError(
        'Invalid compression serialisation stream format'
      );
    });
  });

  describe('when the input has a token field', () => {
    beforeAll(() => {
      argument = 'a';
    });

    beforeEach(() => {
      result = deserializePacketFromBinary(argument);
    });

    it('should return a blank string', () => {
      expect(result).toMatchObject({ t: 'a' });
    });
  });

  describe('when the input has a prefix field', () => {
    beforeAll(() => {
      argument = 'aP0,9.';
    });

    beforeEach(() => {
      result = deserializePacketFromBinary(argument);
    });

    it('should return a blank string', () => {
      expect(result).toMatchObject({ t: 'a', p: [0, 9] });
    });
  });
});
