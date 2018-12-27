const consumeInput = (buffer, bufferSize, input) => {
  let discard = [];
  if (!buffer) {
    buffer = [];
  }

  if (!input || input.length === 0) {
    if (buffer.length > 0) {
      discard = buffer.slice(0, 1);
      buffer = buffer.slice(1, buffer.length);
    }
  } else {
    buffer = buffer.concat(input);
    let overflow = buffer.length - bufferSize;
    if (overflow > 0) {
      discard = buffer.slice(0, overflow);
      buffer = buffer.slice(overflow, buffer.length);
    }
  }

  return { buffer: buffer, discard: discard };
};
export default consumeInput;
