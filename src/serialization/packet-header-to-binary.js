import unpackIntegerByte from './unpack-integer-to-byte';

const packetHeaderToBinary = header => {
    return Buffer.from([0x01, 0x00, 0x00, 0x00, 0x00]);
}

export default packetHeaderToBinary;
