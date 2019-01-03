import headerFlagsEnum from './header-flags-enum';

const packetHeaderSizeFieldWidth = firstHeaderByte => {
    return 1;
}

const packetHeaderFromBinary = headerBytes => {
    const headerBitField = headerBytes[0];
    const isPurePacket = headerBitField & headerFlagsEnum.PURE_PACKET_MODE !== 0 ? true : false;
    const hasPrefix = headerBitField & headerFlagsEnum.HAS_PREFIX ? true : false;
    const prefixByteExtOne = headerBitField & headerFlagsEnum.PREFIX_EXTRA_INT_BYTE_1 ? true : false;

    return ({
        size: headerBytes.readUIntLE(1, packetHeaderSizeFieldWidth(headerBytes[0])),
        isPurePacket,
        hasPrefix,
        prefixByteExtOne,
    });
}

export { packetHeaderFromBinary, packetHeaderSizeFieldWidth };
