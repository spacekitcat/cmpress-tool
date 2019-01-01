import serializePacketToBinary from '../../src/serialization/serialize-packet-to-binary';
describe('serializePacketToBinary', () => {
  let result;
  let argument;

  describe('when the input is a blank string', () => {
    it('should throw an Error', () => {
      expect(() => serializePacketToBinary('')).toThrowError(
        /Error: Invalid compression packet format/
      );
    });
  });

  describe('when the input is undefined', () => {
    it('should throw an Error', () => {
      expect(() => serializePacketToBinary(undefined)).toThrowError(
        /Error: Invalid compression packet format/
      );
    });
  });

  describe('when the input is null', () => {
    it('should throw an Error', () => {
      expect(() => serializePacketToBinary(null)).toThrowError(
        /Error: Invalid compression packet format/
      );
    });
  });

  describe('when the input is an empty object', () => {
    it('should throw an Error', () => {
      expect(() => serializePacketToBinary({})).toThrowError(
        /Error: Invalid compression packet format/
      );
    });
  });

  describe('when the input is a non-empty string (wrong type)', () => {
    it('should throw an Error', () => {
      expect(() => serializePacketToBinary('invalid-arg')).toThrowError(
        /Error: Invalid compression packet format/
      );
    });
  });

  describe('when the input has the wrong datatype for the token, ``', () => {
    it('should throw an Error', () => {
      expect(() => serializePacketToBinary({ t: '' })).toThrowError(
        /Error: Invalid compression packet format/
      );
    });
  });

  describe('when the input has a valid token value, `t`', () => {
    beforeAll(() => {
      argument = { t: Buffer.from([0x70]) };
    });

    beforeEach(() => {
      result = serializePacketToBinary(argument);
    });

    it('should return a binary representation of the packet', () => {
      expect(result).toMatchObject(Buffer.from([0x70]));
    });
  });

  describe('when the input has a blank token value, `t`', () => {
    it('should throw an Error', () => {
      expect(() => serializePacketToBinary({ t: '' })).toThrowError(
        /Error: Invalid compression packet format/
      );
    });
  });

  describe('when the input has a valid, 4 byte token value, `t`', () => {
    beforeAll(() => {
      argument = { t: Buffer.from([0x61, 0x62, 0x63, 0x64]) };
    });

    beforeEach(() => {
      result = serializePacketToBinary(argument);
    });

    it('should return a binary representation of the packet', () => {
      expect(result).toMatchObject(Buffer.from([0x61, 0x62, 0x63, 0x64]));
    });
  });

  describe('when the input has a valid prefix value, `p`', () => {
    beforeAll(() => {
      argument = { t: Buffer.from([0x70]), p: [1, 3] };
    });

    beforeEach(() => {
      result = serializePacketToBinary(argument);
    });

    it('should return a binary representation of the packet', () => {
      expect(result).toMatchObject(Buffer.from([0x70, 0x01, 0x00, 0x03, 0x00]));
    });
  });

  describe('when the input only has 1 position for the prefix value, `p`', () => {
    it('should throw an Error', () => {
      expect(() =>
        serializePacketToBinary({ t: Buffer.from([0x70]), p: [4] })
      ).toThrowError(/Error: Invalid compression packet format./);
    });
  });
});
