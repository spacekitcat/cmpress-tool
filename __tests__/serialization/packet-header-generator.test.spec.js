import packetHeaderGenerator from '../../src/serialization/packet-header-generator';
import headerFlagsEnum from '../../src/serialization/header-flags-enum';

describe('The packetHeaderGenerator function', () => {
  describe('Packet token of size 1', () => {
    it('should serialize the packet metadata', () => {
      expect(
        packetHeaderGenerator({
          t: Buffer.from([0x61])
        })
      ).toMatchObject({ size: 1 });
    });

    describe('and the packet has a 8-bit prefix field', () => {
      it('should serialize the packet metadata', () => {
        expect(
          packetHeaderGenerator({
            t: Buffer.from([0x62]),
            p: [1, 1]
          })
        ).toMatchObject({ size: 3 });
      });
    });
  });

  describe('and the packet has a 16-bit prefix field', () => {
    it('should serialize the packet metadata', () => {
      expect(
        packetHeaderGenerator({
          t: Buffer.from([0x63]),
          p: [1024, 1026]
        })
      ).toMatchObject({ size: 5, hasPrefix: true, prefixByteExtOne: true  });
    });
  });

  describe('and the packet has a 16-bit prefix start and an 8-bit prefix end', () => {
    it('should serialize the packet metadata with two 16-bit prefix fields', () => {
      expect(
        packetHeaderGenerator({
          t: Buffer.from([0x63]),
          p: [1024, 3]
        })
      ).toMatchObject({ size: 5, hasPrefix: true, prefixByteExtOne: true  });
    });
  });

  describe('Packet token of size 3', () => {
    it('should serialize the packet metadata', () => {
      expect(
        packetHeaderGenerator({
          t: Buffer.from([0x64, 0x65, 0x66])
        })
      ).toMatchObject({ size: 3 });
    });
  });
});
