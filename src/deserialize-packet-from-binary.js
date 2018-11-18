const invalidFatalInput = input => typeof input !== 'string' || !input;

const deserializePacketFromBinary = serializedString => {
  if (invalidFatalInput(serializedString)) {
    throw new Error('Error: Invalid compression serialisation stream format.');
  }

  let output = { t: serializedString[0] };
  if (serializedString.length >= 2) {
    if (serializedString[1] === 'P') {
      if (serializedString.length < 5) {
        throw new Error(
          'Invalid compression serialization stream prefix value'
        );
      }

      let prefix = serializedString
        .substr(2, serializedString.length - 1)
        .split(',');
      output.p = [parseInt(prefix[0]), parseInt(prefix[1])];
    } else {
      throw new Error('Error: Invalid compression serialisation stream field.');
    }
  }

  return output;
};

export default deserializePacketFromBinary;
