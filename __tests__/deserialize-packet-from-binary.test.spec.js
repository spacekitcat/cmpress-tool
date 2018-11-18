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

    it('should deserialize with the expected token', () => {
      expect(result).toMatchObject({ t: 'a' });
    });
  });

  describe('when the input has a prefix field', () => {
    beforeAll(() => {
      argument = 'aP0,9';
    });

    beforeEach(() => {
      result = deserializePacketFromBinary(argument);
    });

    it('should deserialize with the expected prefix', () => {
      expect(result).toMatchObject({ t: 'a', p: [0, 9] });
    });
  });

  describe('when the input has a prefix field, but does not define a prefix', () => {
    it('should throw an Error', () => {
      expect(() => deserializePacketFromBinary('aP')).toThrowError(
        'Error: Invalid compression serialisation stream field.'
      );
    });
  });

  describe('when the input has a prefix field, but defines non-integer values', () => {
    it('should throw an Error', () => {
      expect(() => deserializePacketFromBinary('aPx,x')).toThrowError(
        'Invalid compression serialization stream prefix value'
      );
    });
  });

  describe('when the input has a unrecognized field', () => {
    it('should throw an Error', () => {
      expect(() => deserializePacketFromBinary('aK')).toThrowError(
        'Invalid compression serialisation stream field'
      );
    });
  });
});
