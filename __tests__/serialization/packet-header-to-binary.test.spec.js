import packetHeaderToBinary from '../../src/serialization/packet-header-to-binary';
import headerFlagsEnum from '../../src/serialization/header-flags-enum';

describe('The packetHeaderToBinary function', () => {
  describe('Packet of size 1', () => {
    it('should serialize the packet metadata', () => {
      expect(
        packetHeaderToBinary({
          size: 1,
          hasPrefix: false
        })
      ).toMatchObject(Buffer.from([0x01, 0x00, 0x00, 0x00, headerFlagsEnum.OFF]));
    });

    describe('and has the HAS_PREFIX flag', () => {
      it('should serialize the packet metadata', () => {
        expect(
          packetHeaderToBinary({
            size: 1,
            hasPrefix: true
          })
        ).toMatchObject(Buffer.from([0x01, 0x00, 0x00, 0x00, headerFlagsEnum.OFF | headerFlagsEnum.HAS_PREFIX]));
      });
    });
  });

  describe('Packet of size 4294967295', () => {
    it('should serialize the packet metadata', () => {
      expect(
        packetHeaderToBinary({
          size: 4294967295,
          hasPrefix: false
        })
      ).toMatchObject(Buffer.from([0xff, 0xff, 0xff, 0xff, headerFlagsEnum.OFF]));
    });
      
    describe('and has the HAS_PREFIX flag', () => {
        it('should serialize the packet metadata', () => {
          expect(
            packetHeaderToBinary({
              size: 4294967295,
              hasPrefix: true
            })
          ).toMatchObject(Buffer.from([0xFF, 0xFF, 0xFF, 0xFF, headerFlagsEnum.OFF | headerFlagsEnum.HAS_PREFIX]));
        });
      });
  });
});
