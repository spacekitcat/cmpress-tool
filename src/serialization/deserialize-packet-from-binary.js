const invalidFatalInput = input => !input;

const getPrefixFieldByteLen = packetHeader => {
  let prefixIntegerByteLen = 0;
  if (packetHeader.hasPrefix) {
    prefixIntegerByteLen += 1;
  }
  if (packetHeader.prefixByteExtOne) {
    prefixIntegerByteLen += 1;
  }

  return prefixIntegerByteLen;
}

const readPrefixValue = (serialisedBuffer, packetHeader) => {

  const prefixByteLen = getPrefixFieldByteLen(packetHeader);
  let field = serialisedBuffer.slice(serialisedBuffer.length - (prefixByteLen * 2));
  let prefixValue1 = field.readUIntLE(0, prefixByteLen);
  let prefixValue2 = field.readUIntLE(prefixByteLen, prefixByteLen);
  return [prefixValue1, prefixValue2];
};

const deserializePacketFromBinary = (serialisedBuffer, packetHeader) => {

  if (invalidFatalInput(serialisedBuffer)) {
    throw new Error(
      `Invalid compression serialisation stream format for input '${serialisedBuffer}'`
    );
  }

  let output = {};
  if (packetHeader.hasPrefix) {
    output.p = readPrefixValue(serialisedBuffer, packetHeader);
  }

  output.t = serialisedBuffer.slice(0, serialisedBuffer.length - (getPrefixFieldByteLen(packetHeader) * 2));

  return output;
};

export default deserializePacketFromBinary;
