import headerFlagsEnum from './header-flags-enum';

const packetHeaderFromBinary = headerBytes => {
    return ({
        size: headerBytes.readUInt32LE(0),
        hasPrefix: headerBytes[4] & headerFlagsEnum.HAS_PREFIX ? true : false
    });
}

export default packetHeaderFromBinary;
