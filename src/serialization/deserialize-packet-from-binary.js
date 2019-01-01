const invalidFatalInput = input => !input;

const hasPrefixField = input => {
  return input.length === 5
}
const readPrefixValue = field => {
  let prefixValue1 = field.readUInt16LE(0);
  let prefixValue2 = field.readUInt16LE(2);
  return [prefixValue1, prefixValue2];
};

const deserializePacketFromBinary = serialisedBuffer => {

  if (invalidFatalInput(serialisedBuffer)) {
    throw new Error(
      `Invalid compression serialisation stream format for input '${serialisedBuffer}'`
    );
  }

  let output = { t: serialisedBuffer.slice(0, 1) };

  if (hasPrefixField(serialisedBuffer)) {
    let fieldValue = serialisedBuffer.slice(1, serialisedBuffer.length);
    output.p = readPrefixValue(fieldValue);
  } else if (serialisedBuffer.length >= 2) {
    throw new Error(
      `Invalid compression serialisation stream command for input '${serialisedBuffer}'`
    );
  }      

  return output;
};

export default deserializePacketFromBinary;
