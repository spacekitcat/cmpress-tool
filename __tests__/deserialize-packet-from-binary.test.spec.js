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
      result = deserializePacketFromBinary(Buffer.from(argument));
    });

    it('should deserialize with the expected token', () => {
      expect(result).toMatchObject({ t: Buffer.from('a') });
    });
  });

  describe('when the input has a prefix field', () => {
    beforeEach(() => {
      result = deserializePacketFromBinary(Buffer.from([97, 0x00, 0x00, 0x09, 0x00]));
    });

    it('should deserialize with the expected prefix', () => {
      expect(result).toMatchObject({ t: Buffer.from('a'), p: [0, 9] });
    });
  });

  describe('when the input has prefix values above 10', () => {
    beforeEach(() => {
      result = deserializePacketFromBinary(Buffer.from([97, 0x0A, 0x00, 0x7B, 0x00]));
    });

    it('should deserialize with the expected prefix', () => {
      expect(result).toMatchObject({ t: Buffer.from('a'), p: [10, 123] });
    });
  });


  describe('when the input has prefix values above 255', () => {
    beforeEach(() => {
      result = deserializePacketFromBinary(Buffer.from([97, 0x01, 0x02, 0x00, 0x04]));
    });

    it('should deserialize with the expected prefix', () => {
      expect(result).toMatchObject({ t: Buffer.from('a'), p: [513, 1024] });
    });
  });

  describe('when the input has a prefix field, but does not define a prefix', () => {
    const input = Buffer.from('aP');
    it('should throw an Error', () => {
      expect(() =>
        deserializePacketFromBinary(Buffer.from(input))
      ).toThrowError(
        `Invalid compression serialisation stream command for input '${input}'`
      );
    });
  });

  describe('when the input has a unrecognized field', () => {
    const input = Buffer.from('aK');
    it('should throw an Error', () => {
      expect(() =>
        deserializePacketFromBinary(Buffer.from(input))
      ).toThrowError(
        `Invalid compression serialisation stream command for input '${input}'`
      );
    });
  });
});
