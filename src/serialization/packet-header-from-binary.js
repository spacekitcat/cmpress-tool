import headerFlagsEnum from './header-flags-enum';

const packetHeaderSizeFieldWidth = firstHeaderByte => {
  let size = 1;
  
  if (firstHeaderByte & headerFlagsEnum.SIZE_FIELD_EXTRA_INT_BYTE_1) {
    size += 1;
  }

  if (firstHeaderByte & headerFlagsEnum.SIZE_FIELD_EXTRA_INT_BYTE_2) {
    size += 1;
  }

  if (firstHeaderByte & headerFlagsEnum.SIZE_FIELD_EXTRA_INT_BYTE_3) {
    size += 1;
  }

  return size;
};

const packetHeaderFromBinary = headerBytes => {

  let packetHeader = { unreadByteCount: 0 };
  if (headerBytes[0] & headerFlagsEnum.PURE_PACKET_MODE) {
    packetHeader.isPurePacket = true;
    if (headerBytes[0] & headerFlagsEnum.HAS_PREFIX) {
      packetHeader.size = 3;
    } else {
      packetHeader.size = 1;
    }
  } else if (headerBytes.length > packetHeaderSizeFieldWidth(headerBytes[0])) {
    packetHeader.size = headerBytes.readUIntLE(
      1,
      packetHeaderSizeFieldWidth(headerBytes[0])
    );
  } else {
    packetHeader.unreadByteCount = 1 + (packetHeaderSizeFieldWidth(headerBytes[0]) - headerBytes.length);
  }

  if (headerBytes[0] & headerFlagsEnum.HAS_PREFIX) {
    packetHeader.hasPrefix = true;
  }

  if (headerBytes[0] & headerFlagsEnum.PREFIX_EXTRA_INT_BYTE_1) {
    packetHeader.prefixByteExtOne = true;
  }
  
  return packetHeader;
};

export { packetHeaderFromBinary, packetHeaderSizeFieldWidth };
