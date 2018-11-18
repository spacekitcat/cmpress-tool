const invalidFatalInput = input =>
  typeof input !== 'string' ||
  input === undefined ||
  input === null ||
  input === '';

const deserializePacketFromBinary = serializedString => {
  if (invalidFatalInput(serializedString)) {
    throw new Error('Error: Invalid compression serialisation stream format.');
  }

  let output = { t: serializedString };

  return output;
};

export default deserializePacketFromBinary;
