import unpackIntegerByte from './unpack-integer-to-byte';
import headerFlagsEnum from './header-flags-enum';

const packetHeaderToBinary = header => {
  let flags = headerFlagsEnum.OFF;
  let packetSize = header.size;

  if (header.hasPrefix) {
    flags |= headerFlagsEnum.HAS_PREFIX;
  }

  if (header.prefixByteExtOne) {
    flags |= headerFlagsEnum.PREFIX_EXTRA_INT_BYTE_1;
  }

  let result = Buffer.from([flags]);
  if (header.isPurePacket) {
    flags |= headerFlagsEnum.PURE_PACKET_MODE;
    packetSize = undefined;
  }

  if (packetSize) {
    result = Buffer.concat([result, unpackIntegerByte(packetSize, 1)], 2);
  }

  return result;
};

export default packetHeaderToBinary;
