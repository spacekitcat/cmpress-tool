import deserializePacketFromBinary from '../../src/serialization/deserialize-packet-from-binary';

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
      result = deserializePacketFromBinary(Buffer.from(argument), {
        size: 1,
        hasPrefix: false
      });
    });

    it('should deserialize with the expected token', () => {
      expect(result).toMatchObject({ t: Buffer.from('a') });
    });
  });

  describe('when the input has a blank field', () => {
    beforeAll(() => {
      argument = '';
    });

    beforeEach(() => {
      result = deserializePacketFromBinary(Buffer.from(argument), {
        size: 0,
        hasPrefix: false
      });
    });

    it('should deserialize with the expected token', () => {
      expect(result).toMatchObject({ t: Buffer.from('') });
    });
  });

  describe('when the input has a prefix field', () => {
    beforeEach(() => {
      result = deserializePacketFromBinary(Buffer.from([97, 0x00, 0x09]), {
        size: 3,
        hasPrefix: true
      });
    });

    it('should deserialize with the expected prefix', () => {
      expect(result).toMatchObject({ t: Buffer.from('a'), p: [0, 9] });
    });

    describe('and the packet is packed with multiple tokens', () => {
      beforeEach(() => {
        result = deserializePacketFromBinary(
          Buffer.from([0x61, 0x61, 0x61, 0x61]),
          {
            size: 4,
            hasPrefix: false
          }
        );
      });

      it('should deserialize with the expected prefix', () => {
        expect(result).toMatchObject({ t: Buffer.from('aaaa') });
      });

      describe('and the packet has a prefix', () => {
        beforeEach(() => {
          result = deserializePacketFromBinary(
            Buffer.from([0x61, 0x61, 0x61, 0x61, 0x00, 0x09]),
            {
              size: 6,
              hasPrefix: true
            }
          );
        });

        it('should deserialize with the expected prefix', () => {
          expect(result).toMatchObject({ t: Buffer.from('aaaa'), p: [0, 9] });
        });
      });
    });
  });

  describe('when the input has prefix values above 10', () => {
    beforeEach(() => {
      result = deserializePacketFromBinary(Buffer.from([97, 0x0a, 0x7b]), {
        size: 3,
        hasPrefix: true
      });
    });

    it('should deserialize with the expected prefix', () => {
      expect(result).toMatchObject({ t: Buffer.from('a'), p: [10, 123] });
    });
  });

  describe('when the input has prefix values above 255', () => {
    beforeEach(() => {
      result = deserializePacketFromBinary(
        Buffer.from([97, 0x01, 0x02, 0x00, 0x04]),
        {
          size: 5,
          hasPrefix: true,
          prefixByteExtOne: true
        }
      );
    });

    it('should deserialize with the expected prefix', () => {
      expect(result).toMatchObject({ t: Buffer.from('a'), p: [513, 1024] });
    });
  });
});
