import { packetHeaderFromBinary, packetHeaderSizeFieldWidth } from '../../src/serialization/packet-header-from-binary';
import headerFlagsEnum from '../../src/serialization/header-flags-enum';

describe('The packetHeaderFromBinary function', () => {
  describe('Packet of size 1', () => {
    it('should extract the expected packet metadata', () => {
      let options = headerFlagsEnum.OFF;
      expect(
        packetHeaderFromBinary(Buffer.from([options, 0x01]))
      ).toMatchObject({
        size: 1,
        hasPrefix: false
      });
    });

    describe('and has the HAS_PREFIX flag', () => {
      it('should extract the expected packet metadata', () => {
        let options = headerFlagsEnum.OFF | headerFlagsEnum.HAS_PREFIX;
        expect(
          packetHeaderFromBinary(Buffer.from([options, 0x01]))
        ).toMatchObject({
          size: 1,
          hasPrefix: true
        });
      });
    });
  });

  describe('Packet of 4294967295 (32-bit unsigned integer maximum)', () => {
    it('should extract the expected packet metadata', () => {
      let options = headerFlagsEnum.OFF;
      expect(
        packetHeaderFromBinary(Buffer.from([options, 0xff]))
      ).toMatchObject({
        size: 255,
        hasPrefix: false
      });
    });

    describe('and has the HAS_PREFIX flag', () => {
      it('should extract the expected packet metadata', () => {
        let options = headerFlagsEnum.OFF | headerFlagsEnum.HAS_PREFIX;
        expect(
            packetHeaderFromBinary(Buffer.from([options, 0xff]))
            ).toMatchObject({
          size: 255,
          hasPrefix: true
        });
      });
    });
  });
});

describe('The packetHeaderWordSize function', () => {
  describe('Packet of size 1', () => {
    it('should extract the expected packet metadata', () => {
      let options = headerFlagsEnum.OFF;
      expect(
        packetHeaderSizeFieldWidth(Buffer.from([options, 0x01]))
      ).toBe(1);
    });
  });
});
