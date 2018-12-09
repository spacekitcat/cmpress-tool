const invalidFatalInput = input => !input;

const COMMA_CHAR_CODE = 0x2c;
const PREFIX_COMMAND_CHAR_CODE = 0x50;

const hasPrefixField = input => {
  return input.length >= 5 && input[1] === PREFIX_COMMAND_CHAR_CODE;
}
const readPrefixValue = field => {
  let prefixValue1 = field.readUInt8(field.indexOf(COMMA_CHAR_CODE) - 1);
  let prefixValue2 = field.readUInt8(field.indexOf(COMMA_CHAR_CODE) + 1);
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
    let fieldValue = serialisedBuffer.slice(2, serialisedBuffer.length);
    output.p = readPrefixValue(fieldValue);
  } else if (serialisedBuffer.length >= 2) {
    throw new Error(
      `Invalid compression serialisation stream command for input '${serialisedBuffer}'`
    );
  }

  return output;
};

export default deserializePacketFromBinary;
