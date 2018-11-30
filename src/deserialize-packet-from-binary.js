const invalidFatalInput = input => !input;

const hasPrefixField = input => input.length >= 5 && input[1] === 'P';

const readPrefixValue = field => {
  let prefixValues = field.split(',');
  let prefixValue1 = parseInt(prefixValues[0]);
  let prefixValue2 = parseInt(prefixValues[1]);

  if (isNaN(prefixValue1) || isNaN(prefixValue2)) {
    throw new Error(
      `Invalid compression serialisation prefix field, '${field}'`
    );
  }

  return [prefixValue1, prefixValue2];
};

const deserializePacketFromBinary = serializedString => {
  if (invalidFatalInput(serializedString)) {
    throw new Error(
      `Invalid compression serialisation stream format for input '${serializedString}'`
    );
  }

  let output = { t: serializedString[0] };

  if (hasPrefixField(serializedString)) {
    let fieldValue = serializedString.substr(2, serializedString.length - 1);
    output.p = readPrefixValue(fieldValue);
  } else if (serializedString.length >= 2) {
    throw new Error(
      `Invalid compression serialisation stream command for input '${serializedString}'`
    );
  }

  return output;
};

export default deserializePacketFromBinary;
