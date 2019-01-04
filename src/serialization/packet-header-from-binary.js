import headerFlagsEnum from './header-flags-enum';

const packetHeaderSizeFieldWidth = firstHeaderByte => {
  return 1;
};

const packetHeaderFromBinary = headerBytes => {
  const headerBitField = headerBytes[0];

  let packetHeader = {};
  if (headerBitField & headerFlagsEnum.PURE_PACKET_MODE) {
    packetHeader.isPurePacket = true;
  }

  if (headerBitField & headerFlagsEnum.HAS_PREFIX) {
    packetHeader.hasPrefix = true;
  }

  if (headerBitField & headerFlagsEnum.PREFIX_EXTRA_INT_BYTE_1) {
    packetHeader.prefixByteExtOne = true;
  }

  packetHeader.size = headerBytes.readUIntLE(
    1,
    packetHeaderSizeFieldWidth(headerBytes[0])
  );

  return packetHeader;
};

export { packetHeaderFromBinary, packetHeaderSizeFieldWidth };
