import packetHeaderToBinary from '../../src/serialization/packet-header-to-binary';

describe('The packetHeaderToBinary function', () => {
    it('should pass input to output', () => {
        expect(packetHeaderToBinary(Buffer.from([0x80]))).toMatchObject(Buffer.from([0x80]));
    });

});
