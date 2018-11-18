const invalidFatalInput = input => typeof input !== 'string' || !input;

const hasPrefixField = input => input.length >= 5 && input[1] === 'P';

const readPrefixValue = field => {
  let prefixValues = field.split(',');
  let prefixValue1 = parseInt(prefixValues[0]);
  let prefixValue2 = parseInt(prefixValues[1]);

  if (isNaN(prefixValue1) || isNaN(prefixValue2)) {
    throw new Error('Invalid compression serialization stream prefix value');
  }

  return [prefixValue1, prefixValue2];
};

const deserializePacketFromBinary = serializedString => {
  if (invalidFatalInput(serializedString)) {
    throw new Error('Error: Invalid compression serialisation stream format.');
  }

  let output = { t: serializedString[0] };

  if (hasPrefixField(serializedString)) {
    let fieldValue = serializedString.substr(2, serializedString.length - 1);
    output.p = readPrefixValue(fieldValue);
  } else if (serializedString.length >= 2) {
    throw new Error('Error: Invalid compression serialisation stream field.');
  }

  return output;
};

export default deserializePacketFromBinary;
