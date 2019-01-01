
import unpackIntegerByte from './unpack-integer-to-byte';
import headerFlagsEnum from './header-flags-enum';

const packetHeaderToBinary = header => {
    let flags = headerFlagsEnum.OFF;

    if (header.hasPrefix) {
        flags |= headerFlagsEnum.HAS_PREFIX;
    }

    return Buffer.concat([
        unpackIntegerByte(header.size, 4),
        Buffer.from([flags])], 5)
}

export default packetHeaderToBinary;
