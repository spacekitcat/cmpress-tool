const validTokenField = input => typeof input.t !== String && input.t;

const prefixFieldExists = input => input.p !== undefined;
const validPrefixField = input => input.p && input.p.length === 2;

const invalidInput = input =>
  !input ||
  typeof input !== 'object' ||
  !validTokenField(input) ||
  (prefixFieldExists(input) && !validPrefixField(input));

const serializePacketToBinary = compressionPackets => {
  if (invalidInput(compressionPackets)) {
    throw new Error(
      `Error: Invalid compression packet format: ${compressionPackets}`
    );
  }

  let output = `${compressionPackets.t}`;
  if (
    prefixFieldExists(compressionPackets) &&
    validPrefixField(compressionPackets)
  ) {
    output += `P${compressionPackets.p[0]},${compressionPackets.p[1]}`;
  }

  return output;
};

export default serializePacketToBinary;
