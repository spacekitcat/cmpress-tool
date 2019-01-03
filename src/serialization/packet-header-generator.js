import unpackIntegerByte from './unpack-integer-to-byte';

const packetHeaderGenerator = packet => {
  let size = packet.t.length;

  let header = {};
  if (packet.p && packet.p.length > 0) {
      header.hasPrefix = true;
      const prefixStartByteLen = unpackIntegerByte(packet.p[0]).length; 
      const prefixEndByteLen = unpackIntegerByte(packet.p[1]).length; 
      const largestPrefixByteLen = prefixStartByteLen > prefixEndByteLen ? prefixStartByteLen : prefixEndByteLen;
      size += 2 * largestPrefixByteLen;

      if (largestPrefixByteLen > 1) {
          header.prefixByteExtOne = true;
      }
  }
  header.size = size;

  return header;
};

export default packetHeaderGenerator;
