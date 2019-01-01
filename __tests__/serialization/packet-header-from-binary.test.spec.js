import packetHeaderFromBinary from '../../src/serialization/packet-header-from-binary';

const HAS_PREFIX = 0x00000001;

describe('The packetHeaderFromBinary function', () => {
  describe('Packet of size 1', () => {
    it('should extract the expected packet metadata', () => {
      let options = 0x000000000;
      expect(
        packetHeaderFromBinary(Buffer.from([0x01, 0x00, 0x00, 0x00, options]))
      ).toMatchObject({
        size: 1,
        hasPrefix: false
      });
    });

    describe('and has the HAS_PREFIX flag', () => {
      it('should extract the expected packet metadata', () => {
        let options = 0x000000000 | HAS_PREFIX;
        expect(
          packetHeaderFromBinary(Buffer.from([0x01, 0x00, 0x00, 0x00, options]))
        ).toMatchObject({
          size: 1,
          hasPrefix: true
        });
      });
    });
  });

  describe('Packet of 4294967295 (32-bit unsigned integer maximum)', () => {
    it('should extract the expected packet metadata', () => {
      let options = 0x000000000;
      expect(
        packetHeaderFromBinary(Buffer.from([0xff, 0xff, 0xff, 0xff, options]))
      ).toMatchObject({
        size: 4294967295,
        hasPrefix: false
      });
    });

    describe('and has the HAS_PREFIX flag', () => {
      it('should extract the expected packet metadata', () => {
        let options = 0x000000000 | HAS_PREFIX;
        expect(
            packetHeaderFromBinary(Buffer.from([0xff, 0xff, 0xff, 0xff, options]))
            ).toMatchObject({
          size: 4294967295,
          hasPrefix: true
        });
      });
    });
  });
});
