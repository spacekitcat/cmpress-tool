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
            size: 3,
            hasPrefix: true
          })
        ).toMatchObject(
          Buffer.from([headerFlagsEnum.OFF | headerFlagsEnum.HAS_PREFIX, 0x03])
        );
      });

      describe('and has the PURE_PACKET_MODE flag', () => {
        it('should serialize the packet metadata', () => {
          expect(
            packetHeaderToBinary({
              size: 3,
              hasPrefix: true,
              isPurePacket: true
            })
          ).toMatchObject(
            Buffer.from([
              headerFlagsEnum.OFF | headerFlagsEnum.HAS_PREFIX | headerFlagsEnum.PURE_PACKET_MODE
            ])
          );
        });
      });
    });

    describe('and has the PURE_PACKET_MODE flag', () => {
      it('should serialize the packet metadata', () => {
        expect(
          packetHeaderToBinary({
            size: 1,
            isPurePacket: true,
          })
        ).toMatchObject(
          Buffer.from([
            headerFlagsEnum.OFF | headerFlagsEnum.PURE_PACKET_MODE
          ])
        );
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
        ).toMatchObject(
          Buffer.from([headerFlagsEnum.OFF | headerFlagsEnum.HAS_PREFIX, 0xff])
        );
      });
    });

    describe('and has the PREFIX_EXTRA_INT_BYTE_1 flag', () => {
      it('should serialize the packet metadata', () => {
        expect(
          packetHeaderToBinary({
            size: 255,
            hasPrefix: true,
            prefixByteExtOne: true
          })
        ).toMatchObject(
          Buffer.from([
            headerFlagsEnum.OFF |
              headerFlagsEnum.HAS_PREFIX |
              headerFlagsEnum.PREFIX_EXTRA_INT_BYTE_1,
            0xff
          ])
        );
      });
    });
  });
});
