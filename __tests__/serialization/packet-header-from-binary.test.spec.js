import {
  packetHeaderFromBinary,
  packetHeaderSizeFieldWidth
} from '../../src/serialization/packet-header-from-binary';
import headerFlagsEnum from '../../src/serialization/header-flags-enum';

describe('The packetHeaderFromBinary function', () => {
  describe('Packet of size 1', () => {
    it('should extract the expected packet metadata', () => {
      let options = headerFlagsEnum.OFF;
      expect(
        packetHeaderFromBinary(Buffer.from([options, 0x01]))
      ).toMatchObject({
        size: 1,
        unreadByteCount: 0
      });
    });

    describe('and the packet contains 1 byte out of the expected 2 (partial)', () => {
      it('should return empty object', () => {
        let options = headerFlagsEnum.OFF;
        expect(
          packetHeaderFromBinary(Buffer.from([options]))
        ).toMatchObject({
          unreadByteCount: 1
        });
      });
    });

    describe('and has the HAS_PREFIX flag', () => {
      it('should extract the expected packet metadata', () => {
        let options = headerFlagsEnum.OFF | headerFlagsEnum.HAS_PREFIX;
        expect(
          packetHeaderFromBinary(Buffer.from([options, 0x01]))
        ).toMatchObject({
          size: 1,
          hasPrefix: true,
          unreadByteCount: 0
        });
      });

      describe('and has the PURE_PACKET_MODE flag', () => {
        it('should serialize the packet metadata', () => {
          let options = headerFlagsEnum.OFF | headerFlagsEnum.HAS_PREFIX | headerFlagsEnum.PURE_PACKET_MODE;

          expect(
            packetHeaderFromBinary(Buffer.from([options]))
          ).toMatchObject({
            size: 1,
            hasPrefix: true,
            isPurePacket: true,
            unreadByteCount: 0
          });
        });
      });
    });

    describe('and has the PURE_PACKET_MODE flag', () => {
      it('should serialize the packet metadata', () => {
        let options = headerFlagsEnum.OFF | headerFlagsEnum.PURE_PACKET_MODE;

        expect(
          packetHeaderFromBinary(Buffer.from([options]))
        ).toMatchObject({
          size: 1,
          isPurePacket: true,
          unreadByteCount: 0
        });
      });
    });

    describe('and has the PREFIX_EXTRA_INT_BYTE_1 flag', () => {
      it('should extract the expected packet metadata', () => {
        let options =
          headerFlagsEnum.OFF |
          headerFlagsEnum.HAS_PREFIX |
          headerFlagsEnum.PREFIX_EXTRA_INT_BYTE_1;

        expect(
          packetHeaderFromBinary(Buffer.from([options, 0x01]))
        ).toMatchObject({
          size: 1,
          hasPrefix: true,
          prefixByteExtOne: true,
          unreadByteCount: 0
        });
      });
    });
  });

  describe('Packet of 255 (8-bit unsigned integer maximum)', () => {
    it('should extract the expected packet metadata', () => {
      let options = headerFlagsEnum.OFF;
      expect(
        packetHeaderFromBinary(Buffer.from([options, 0xff]))
      ).toMatchObject({
        size: 255,
        unreadByteCount: 0
      });
    });

    describe('and has the HAS_PREFIX flag', () => {
      it('should extract the expected packet metadata', () => {
        let options = headerFlagsEnum.OFF | headerFlagsEnum.HAS_PREFIX;
        expect(
          packetHeaderFromBinary(Buffer.from([options, 0xff]))
        ).toMatchObject({
          size: 255,
          hasPrefix: true,
          unreadByteCount: 0
        });
      });
    });
  });
});

describe('The packetHeaderWordSize function', () => {
  describe('Packet of size 1', () => {
    it('should extract the expected packet metadata', () => {
      let options = headerFlagsEnum.OFF;
      expect(packetHeaderSizeFieldWidth(Buffer.from([options, 0x01]))).toBe(1);
    });
  });
});
