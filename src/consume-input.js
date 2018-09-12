import _ from 'lodash';

const sanitiseInput = input => (input ? input : []);

const consumeInput = (buffer, bufferSize, input) => {
  if (!buffer) {
    buffer = [];
  }

  if (!input) {
    input = [];
  }

  buffer = buffer.concat(input);
  return {
    buffer: _.takeRight(buffer, Math.max(bufferSize, input.length)),
    discard: _.take(buffer, buffer.length - Math.max(bufferSize, input.length))
  };
};
export default consumeInput;
