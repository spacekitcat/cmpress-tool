import packetHeaderFromBinary from '../../src/serialization/packet-header-from-binary';

describe('The packetHeaderFromBinary function', () => {
    it('should pass input to output', () => {
        expect(packetHeaderFromBinary(Buffer.from([0x80]))).toMatchObject(Buffer.from([0x80]));
    });

});
