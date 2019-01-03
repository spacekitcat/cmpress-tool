import packetHeaderGenerator from '../../src/serialization/packet-header-generator';
import headerFlagsEnum from '../../src/serialization/header-flags-enum';

describe('The packetHeaderGenerator function', () => {
  describe('Packet of size 1', () => {
    it('should serialize the packet metadata', () => {
      expect(
        packetHeaderGenerator({
          t: 0x61,
        })
      ).toMatchObject({size: 1});
    });
  });
});
