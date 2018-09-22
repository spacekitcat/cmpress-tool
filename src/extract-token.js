import _ from 'lodash';

const extractToken = (dictionary, dictionarySize, position, length) => {
  if (_.isEmpty(dictionary) || dictionarySize === 0) {
    return undefined;
  }

  if (position === length) {
    return [dictionary.slice().reverse()[position]];
  }

  return dictionary
    .slice()
    .reverse()
    .slice(position, position + length)
    .reverse();
};

export default extractToken;
