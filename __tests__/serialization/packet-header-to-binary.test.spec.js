import packetHeaderToBinary from '../../src/serialization/packet-header-to-binary';

describe('The packetHeaderToBinary function', () => {
  describe('Packet of size 1', () => {
    it('should serialize the packet metadata', () => {
      expect(
        packetHeaderToBinary({
          size: 1,
          hasPrefix: false
        })
      ).toMatchObject(Buffer.from([0x01, 0x00, 0x00, 0x00, 0x00]));
    });
  });
});
