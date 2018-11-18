const missingTokenField = input =>
  typeof input === 'object' && input.t === undefined;

const invalidTokenField = input =>
  input.t === null || input.t === '' || typeof input.t !== 'string';

const invalidPrefixField = input => input.p === null || input.p.length !== 2;

const invalidFatalInput = input =>
  input === null ||
  typeof input !== 'object' ||
  (input.t !== undefined && invalidTokenField(input)) ||
  (input.p !== undefined && invalidPrefixField(input));

const serializePacketToBinary = compressionPackets => {
  if (invalidFatalInput(compressionPackets)) {
    throw new Error('Error: Invalid compression packet format.');
  }

  if (missingTokenField(compressionPackets)) {
    return '';
  }

  let output = `${compressionPackets.t}`;
  if (compressionPackets.p && !invalidPrefixField(compressionPackets)) {
    output += `P${compressionPackets.p[0]},${compressionPackets.p[1]}`;
  }

  return output;
};

export default serializePacketToBinary;
