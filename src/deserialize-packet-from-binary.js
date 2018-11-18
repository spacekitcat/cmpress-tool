const invalidFatalInput = input => typeof input !== 'string' || !input;

const deserializePacketFromBinary = serializedString => {
  if (invalidFatalInput(serializedString)) {
    throw new Error('Error: Invalid compression serialisation stream format.');
  }

  let inputPointer = 1;
  let output = { t: serializedString[0] };
  while (inputPointer < serializedString.length) {
    if (serializedString[inputPointer] === 'P') {
      ++inputPointer;
      let prefixFieldValue = serializedString.substr(
        inputPointer,
        serializedString.indexOf('.') - 2
      );
      let prefix = prefixFieldValue.split(',');
      output.p = [parseInt(prefix[0]), parseInt(prefix[1])];
      inputPointer += prefixFieldValue.length;
    } else {
      ++inputPointer;
    }
  }

  return output;
};

export default deserializePacketFromBinary;
