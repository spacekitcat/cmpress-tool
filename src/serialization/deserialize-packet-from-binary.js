const invalidFatalInput = input => !input;

const hasPrefixField = input => {
  return input.length === 5
}
const readPrefixValue = field => {
  let prefixValue1 = field.readUInt16LE(0);
  let prefixValue2 = field.readUInt16LE(2);
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
    let fieldValue = serialisedBuffer.slice(serialisedBuffer.length - 4, serialisedBuffer.length);
    output.p = readPrefixValue(fieldValue);
    output.t = serialisedBuffer.slice(0, serialisedBuffer.length - 4);
  } else {
    output.t = serialisedBuffer.slice(0, serialisedBuffer.length);
  }

  return output;
};

export default deserializePacketFromBinary;
