
import unpackIntegerByte from './unpack-integer-to-byte';
import headerFlagsEnum from './header-flags-enum';

const packetHeaderToBinary = header => {
    let flags = headerFlagsEnum.OFF;

    if (header.hasPrefix) {
        flags |= headerFlagsEnum.HAS_PREFIX;
    }

    if (header.prefixByteExtOne) {
        flags |= headerFlagsEnum.PREFIX_EXTRA_INT_BYTE_1;
    }

    return Buffer.concat([
        Buffer.from([flags]),
        unpackIntegerByte(header.size, 1)
        ], 2)
}

export default packetHeaderToBinary;
