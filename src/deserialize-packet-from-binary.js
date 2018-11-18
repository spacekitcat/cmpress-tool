const invalidFatalInput = input => typeof input !== 'string' || !input;

const hasPrefixField = input => input.length >= 5 && input[1] === 'P';

const deserializePacketFromBinary = serializedString => {
  if (invalidFatalInput(serializedString)) {
    throw new Error('Error: Invalid compression serialisation stream format.');
  }

  let output = { t: serializedString[0] };

  if (hasPrefixField(serializedString)) {
    let prefix = serializedString
      .substr(2, serializedString.length - 1)
      .split(',');
    let prefixValue1 = parseInt(prefix[0]);
    let prefixValue2 = parseInt(prefix[1]);
    if (isNaN(prefixValue1) || isNaN(prefixValue2)) {
      throw new Error('Invalid compression serialization stream prefix value');
    }
    output.p = [prefixValue1, prefixValue2];
  } else if (serializedString.length >= 2) {
    throw new Error('Error: Invalid compression serialisation stream field.');
  }

  return output;
};

export default deserializePacketFromBinary;
