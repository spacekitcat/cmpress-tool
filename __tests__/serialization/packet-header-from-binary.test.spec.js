import {
  packetHeaderFromBinary,
  packetHeaderSizeFieldWidth
} from '../../src/serialization/packet-header-from-binary';
import headerFlagsEnum from '../../src/serialization/header-flags-enum';

describe('The packetHeaderFromBinary function', () => {
  describe('2-bytes provided of 2-byte header [OFF][1]', () => {
    it('should extract the expected packet metadata', () => {
      let options = headerFlagsEnum.OFF;

      expect(
        packetHeaderFromBinary(Buffer.from([options, 0x01]))
      ).toMatchObject({
        size: 1,
        unreadByteCount: 0
      });
    });
  });

  describe('1-byte provided of 2-byte header [OFF][__MISSING__]', () => {
    it('should partially extract the expected packet metadata', () => {
      let options = headerFlagsEnum.OFF;
      expect(packetHeaderFromBinary(Buffer.from([options]))).toMatchObject({
        unreadByteCount: 1
      });
    });
  });

  describe('2-bytes provided of 2-byte header [OFF | HAS_PREFIX][3]', () => {
    it('should extract the expected packet metadata', () => {
      let options = headerFlagsEnum.OFF | headerFlagsEnum.HAS_PREFIX;
      expect(
        packetHeaderFromBinary(Buffer.from([options, 0x03]))
      ).toMatchObject({
        size: 3,
        hasPrefix: true,
        unreadByteCount: 0
      });
    });
  });


  describe('1-byte provided of 2-byte header [OFF | HAS_PREFIX][__MISSING__]', () => {
    it('should extract the expected packet metadata', () => {
      let options = headerFlagsEnum.OFF | headerFlagsEnum.HAS_PREFIX;
      expect(
        packetHeaderFromBinary(Buffer.from([options]))
      ).toMatchObject({
        hasPrefix: true,
        unreadByteCount: 1
      });
    });
  });

  describe('1-byte provided of 1-byte header [OFF | PURE_PACKET_MODE]', () => {
    it('should serialize the packet metadata', () => {
      let options = headerFlagsEnum.OFF | headerFlagsEnum.PURE_PACKET_MODE;

      expect(packetHeaderFromBinary(Buffer.from([options]))).toMatchObject({
        size: 1,
        isPurePacket: true,
        unreadByteCount: 0
      });
    });
  });

  describe('1-byte provided of 1-byte header [OFF | HAS_PREFIX | PURE_PACKET_MODE]', () => {
    it('should serialize the packet metadata', () => {
      let options =
        headerFlagsEnum.OFF |
        headerFlagsEnum.HAS_PREFIX |
        headerFlagsEnum.PURE_PACKET_MODE;

      expect(packetHeaderFromBinary(Buffer.from([options]))).toMatchObject({
        size: 3,
        hasPrefix: true,
        isPurePacket: true,
        unreadByteCount: 0
      });
    });
  });

  describe('2-bytes provided of 2-byte header [OFF | HAS_PREFIX | PREFIX_EXTRA_INT_BYTE_1]', () => {
    it('should extract the expected packet metadata', () => {
      let options =
        headerFlagsEnum.OFF |
        headerFlagsEnum.HAS_PREFIX |
        headerFlagsEnum.PREFIX_EXTRA_INT_BYTE_1;

      expect(
        packetHeaderFromBinary(Buffer.from([options, 0x05]))
      ).toMatchObject({
        size: 5,
        hasPrefix: true,
        prefixByteExtOne: true,
        unreadByteCount: 0
      });
    });
  });

  describe('1-byte provided of 2-byte header [OFF | HAS_PREFIX | PREFIX_EXTRA_INT_BYTE_1][__MISSING__]', () => {
    it('should extract the expected packet metadata', () => {
      let options =
        headerFlagsEnum.OFF |
        headerFlagsEnum.HAS_PREFIX |
        headerFlagsEnum.PREFIX_EXTRA_INT_BYTE_1;

      expect(
        packetHeaderFromBinary(Buffer.from([options]))
      ).toMatchObject({
        hasPrefix: true,
        prefixByteExtOne: true,
        unreadByteCount: 1
      });
    });
  });

  describe('3-bytes provided of 3-byte header [OFF | SIZE_FIELD_EXTRA_INT_BYTE_1][0xAB][0xFF]', () => {
    it('should extract the expected packet metadata', () => {
      let options =
        headerFlagsEnum.OFF |
        headerFlagsEnum.SIZE_FIELD_EXTRA_INT_BYTE_1;

      expect(
        packetHeaderFromBinary(Buffer.from([options, 0xAB, 0xFF]))
      ).toMatchObject({
        size: 65451,
        unreadByteCount: 0
      });
    });
  });

  describe('2-bytes provided of 3-byte header [OFF | SIZE_FIELD_EXTRA_INT_BYTE_1][0xAB][__MISSING__]', () => {
    it('should extract the expected packet metadata', () => {
      let options =
        headerFlagsEnum.OFF |
        headerFlagsEnum.SIZE_FIELD_EXTRA_INT_BYTE_1;

      expect(
        packetHeaderFromBinary(Buffer.from([options, 0xAB]))
      ).toMatchObject({
        unreadByteCount: 1
      });
    });
  });

  describe('1-byte provided of 3-byte header [OFF | SIZE_FIELD_EXTRA_INT_BYTE_1][__MISSING__][__MISSING__]', () => {
    it('should extract the expected packet metadata', () => {
      let options =
        headerFlagsEnum.OFF |
        headerFlagsEnum.SIZE_FIELD_EXTRA_INT_BYTE_1;

      expect(
        packetHeaderFromBinary(Buffer.from([options]))
      ).toMatchObject({
        unreadByteCount: 2
      });
    });
  });

  describe('4-bytes provided of 4-byte header [OFF | SIZE_FIELD_EXTRA_INT_BYTE_1 | SIZE_FIELD_EXTRA_INT_BYTE_2][0xAB][0xFF][0xFF]', () => {
    it('should extract the expected packet metadata', () => {
      let options =
        headerFlagsEnum.OFF |
        headerFlagsEnum.SIZE_FIELD_EXTRA_INT_BYTE_1 |
        headerFlagsEnum.SIZE_FIELD_EXTRA_INT_BYTE_2;

      expect(
        packetHeaderFromBinary(Buffer.from([options, 0xAB, 0xFF, 0xFF]))
      ).toMatchObject({
        size: 16777131,
        unreadByteCount: 0
      });
    });
  });

  describe('3-bytes provided of 4-byte header [OFF | SIZE_FIELD_EXTRA_INT_BYTE_1 | SIZE_FIELD_EXTRA_INT_BYTE_2][0xAB][0xFF][__MISSING__]', () => {
    it('should extract the expected packet metadata', () => {
      let options =
        headerFlagsEnum.OFF |
        headerFlagsEnum.SIZE_FIELD_EXTRA_INT_BYTE_1 |
        headerFlagsEnum.SIZE_FIELD_EXTRA_INT_BYTE_2;

      expect(
        packetHeaderFromBinary(Buffer.from([options, 0xAB, 0xFF]))
      ).toMatchObject({
        unreadByteCount: 1
      });
    });
  });

  describe('2-bytes provided of 4-byte header [OFF | SIZE_FIELD_EXTRA_INT_BYTE_1 | SIZE_FIELD_EXTRA_INT_BYTE_2][0xAB][__MISSING__][__MISSING__]', () => {
    it('should extract the expected packet metadata', () => {
      let options =
        headerFlagsEnum.OFF |
        headerFlagsEnum.SIZE_FIELD_EXTRA_INT_BYTE_1 |
        headerFlagsEnum.SIZE_FIELD_EXTRA_INT_BYTE_2;

      expect(
        packetHeaderFromBinary(Buffer.from([options, 0xAB]))
      ).toMatchObject({
        unreadByteCount: 2
      });
    });
  });

  describe('1-bytes provided of 4-byte header [OFF | SIZE_FIELD_EXTRA_INT_BYTE_1 | SIZE_FIELD_EXTRA_INT_BYTE_2][__MISSING__]', () => {
    it('should extract the expected packet metadata', () => {
      let options =
        headerFlagsEnum.OFF |
        headerFlagsEnum.SIZE_FIELD_EXTRA_INT_BYTE_1 |
        headerFlagsEnum.SIZE_FIELD_EXTRA_INT_BYTE_2;

      expect(
        packetHeaderFromBinary(Buffer.from([options]))
      ).toMatchObject({
        unreadByteCount: 3
      });
    });
  });

  describe('5-bytes provided of 5-byte header [OFF | SIZE_FIELD_EXTRA_INT_BYTE_1 | SIZE_FIELD_EXTRA_INT_BYTE_2 | SIZE_FIELD_EXTRA_INT_BYTE_3][0xAB][0xFF][0xFF][0xFF]', () => {
    it('should extract the expected packet metadata', () => {
      let options =
        headerFlagsEnum.OFF |
        headerFlagsEnum.SIZE_FIELD_EXTRA_INT_BYTE_1 |
        headerFlagsEnum.SIZE_FIELD_EXTRA_INT_BYTE_2 |
        headerFlagsEnum.SIZE_FIELD_EXTRA_INT_BYTE_3;

      expect(
        packetHeaderFromBinary(Buffer.from([options, 0xAB, 0xFF, 0xFF, 0xFF]))
      ).toMatchObject({
        size: 4294967211,
        unreadByteCount: 0
      });
    });
  });

  describe('4-bytes provided of 5-byte header [OFF | SIZE_FIELD_EXTRA_INT_BYTE_1 | SIZE_FIELD_EXTRA_INT_BYTE_2 | SIZE_FIELD_EXTRA_INT_BYTE_3][0xAB][0xFF][0xFF][__MISSING__]', () => {
    it('should extract the expected packet metadata', () => {
      let options =
        headerFlagsEnum.OFF |
        headerFlagsEnum.SIZE_FIELD_EXTRA_INT_BYTE_1 |
        headerFlagsEnum.SIZE_FIELD_EXTRA_INT_BYTE_2 |
        headerFlagsEnum.SIZE_FIELD_EXTRA_INT_BYTE_3;

      expect(
        packetHeaderFromBinary(Buffer.from([options, 0xAB, 0xFF, 0xFF]))
      ).toMatchObject({
        unreadByteCount: 1
      });
    });
  });

  describe('3-bytes provided of 5-byte header [OFF | SIZE_FIELD_EXTRA_INT_BYTE_1 | SIZE_FIELD_EXTRA_INT_BYTE_2 | SIZE_FIELD_EXTRA_INT_BYTE_3][0xAB][0xFF][__MISSING__][__MISSING__]', () => {
    it('should extract the expected packet metadata', () => {
      let options =
        headerFlagsEnum.OFF |
        headerFlagsEnum.SIZE_FIELD_EXTRA_INT_BYTE_1 |
        headerFlagsEnum.SIZE_FIELD_EXTRA_INT_BYTE_2 |
        headerFlagsEnum.SIZE_FIELD_EXTRA_INT_BYTE_3;

      expect(
        packetHeaderFromBinary(Buffer.from([options, 0xAB, 0xFF]))
      ).toMatchObject({
        unreadByteCount: 2
      });
    });
  });

  describe('2-bytes provided of 5-byte header [OFF | SIZE_FIELD_EXTRA_INT_BYTE_1 | SIZE_FIELD_EXTRA_INT_BYTE_2 | SIZE_FIELD_EXTRA_INT_BYTE_3][0xAB][__MISSING__][__MISSING__][__MISSING__]', () => {
    it('should extract the expected packet metadata', () => {
      let options =
        headerFlagsEnum.OFF |
        headerFlagsEnum.SIZE_FIELD_EXTRA_INT_BYTE_1 |
        headerFlagsEnum.SIZE_FIELD_EXTRA_INT_BYTE_2 |
        headerFlagsEnum.SIZE_FIELD_EXTRA_INT_BYTE_3;

      expect(
        packetHeaderFromBinary(Buffer.from([options, 0xAB]))
      ).toMatchObject({
        unreadByteCount: 3
      });
    });
  });

  describe('1-bytes provided of 5-byte header [OFF | SIZE_FIELD_EXTRA_INT_BYTE_1 | SIZE_FIELD_EXTRA_INT_BYTE_2 | SIZE_FIELD_EXTRA_INT_BYTE_3][__MISSING__][__MISSING__][__MISSING__][__MISSING__]', () => {
    it('should extract the expected packet metadata', () => {
      let options =
        headerFlagsEnum.OFF |
        headerFlagsEnum.SIZE_FIELD_EXTRA_INT_BYTE_1 |
        headerFlagsEnum.SIZE_FIELD_EXTRA_INT_BYTE_2 |
        headerFlagsEnum.SIZE_FIELD_EXTRA_INT_BYTE_3;

      expect(
        packetHeaderFromBinary(Buffer.from([options]))
      ).toMatchObject({
        unreadByteCount: 4
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
