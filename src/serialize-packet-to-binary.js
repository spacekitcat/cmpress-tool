const invalidInputType = input => typeof input !== 'object';
const invalidInputTokenField = input =>
  !input || (input.t && typeof input.t !== 'string');

const invalidSafeToIgnoreInput = input => !input || input === '';
const invalidFatalInput = input =>
  invalidInputType(input) || invalidInputTokenField(input);

const serializePacketToBinary = compressionPackets => {
  if (invalidSafeToIgnoreInput(compressionPackets)) {
    return '';
  }

  if (invalidFatalInput(compressionPackets)) {
    throw new Error('Error: Invalid compression packet format.');
  }

  if (compressionPackets.t) {
    return '1g';
  }

  return '';
};

export default serializePacketToBinary;
