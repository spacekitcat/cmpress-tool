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
      ).toMatchObject(Buffer.from([headerFlagsEnum.OFF, 0x01]));
    });

    describe('and has the HAS_PREFIX flag', () => {
      it('should serialize the packet metadata', () => {
        expect(
          packetHeaderToBinary({
            size: 1,
            hasPrefix: true
          })
        ).toMatchObject(Buffer.from([headerFlagsEnum.OFF | headerFlagsEnum.HAS_PREFIX, 0x01]));
      });
    });
  });

  describe('Packet of size 255', () => {
    it('should serialize the packet metadata', () => {
      expect(
        packetHeaderToBinary({
          size: 255,
          hasPrefix: false
        })
      ).toMatchObject(Buffer.from([headerFlagsEnum.OFF, 0xff]));
    });
      
    describe('and has the HAS_PREFIX flag', () => {
        it('should serialize the packet metadata', () => {
          expect(
            packetHeaderToBinary({
              size: 255,
              hasPrefix: true
            })
          ).toMatchObject(Buffer.from([headerFlagsEnum.OFF | headerFlagsEnum.HAS_PREFIX, 0xFF]));
        });
      });
  });
});
