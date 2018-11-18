const invalidFatalInput = input => typeof input !== 'string' || !input;

const deserializePacketFromBinary = serializedString => {
  if (invalidFatalInput(serializedString)) {
    throw new Error('Error: Invalid compression serialisation stream format.');
  }

  let output = { t: serializedString };

  return output;
};

export default deserializePacketFromBinary;
