import headerFlagsEnum from './header-flags-enum';

const packetHeaderSizeFieldWidth = firstHeaderByte => {
    return 1;
}

const packetHeaderFromBinary = headerBytes => {
    return ({
        size: headerBytes.readUIntLE(1, packetHeaderSizeFieldWidth(headerBytes[0])),
        hasPrefix: headerBytes[0] & headerFlagsEnum.HAS_PREFIX ? true : false
    });
}

export { packetHeaderFromBinary, packetHeaderSizeFieldWidth };
