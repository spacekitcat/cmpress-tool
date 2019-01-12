import unpackIntegerByte from './unpack-integer-to-byte';

const validTokenField = input => typeof input.t !== String && input.t;

const prefixFieldExists = input => input.p !== undefined;
const validPrefixField = input => input.p && input.p.length === 2;

const invalidInput = input =>
  !input ||
  typeof input !== 'object' ||
  !validTokenField(input) ||
  (prefixFieldExists(input) && !validPrefixField(input));

const packetToBinary = compressionPackets => {
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
    let prefixStart = unpackIntegerByte(compressionPackets.p[0]);
    let prefixEnd = unpackIntegerByte(compressionPackets.p[1]);

    let prefixByteWidth =
      prefixStart.length > prefixEnd.length
        ? prefixStart.length
        : prefixEnd.length;
    
    output = Buffer.concat([
      output,
      unpackIntegerByte(compressionPackets.p[0], prefixByteWidth),
      unpackIntegerByte(compressionPackets.p[1], prefixByteWidth)
    ]);
  }

  return output;
};

export default packetToBinary;
