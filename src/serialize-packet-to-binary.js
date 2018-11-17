const missingTokenField = input =>
  typeof input === 'object' && input.t === undefined;

const validateTokenField = input =>
  input.t === undefined || input.t === null || typeof input.t === 'string';

const validatePrefixField = input =>
  input.p === undefined || input.p === null || input.p.length === 2;

const invalidSafeToIgnoreInput = input =>
  input === undefined || input === null || missingTokenField(input);

const invalidFatalInput = input =>
  typeof input !== 'object' ||
  !input ||
  (input.t && !validateTokenField(input)) ||
  (input.p && !validatePrefixField(input));

const serializePacketToBinary = compressionPackets => {
  if (invalidSafeToIgnoreInput(compressionPackets)) {
    return '';
  }

  if (invalidFatalInput(compressionPackets)) {
    throw new Error('Error: Invalid compression packet format.');
  }

  let output = '';
  if (compressionPackets.t) {
    output = `${compressionPackets.t}`;
    if (compressionPackets.p && validatePrefixField(compressionPackets.p)) {
      output += `P${compressionPackets.p[0]},${compressionPackets.p[1]}`;
    }
  }

  return output;
};

export default serializePacketToBinary;
