import unpackIntegerByte from './unpack-integer-to-byte';

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

  let output = Buffer.from(compressionPackets.t);
  if (
    prefixFieldExists(compressionPackets) &&
    validPrefixField(compressionPackets)
  ) {
    let prefix;
    if (compressionPackets.p.length === 2) {
      prefix = Buffer.from([0x50]);
      prefix = Buffer.concat([prefix, unpackIntegerByte(compressionPackets.p[0], 2)]);
      prefix = Buffer.concat([prefix, unpackIntegerByte(compressionPackets.p[1], 2)]);
    }

    output = Buffer.concat([output, prefix]);
  }

  return output;
};

export default serializePacketToBinary;
