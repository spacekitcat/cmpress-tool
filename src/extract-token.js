import _ from 'lodash';

const getPossibleTokens = buffer => {
  let tokenList = [];

  for (let i = 1; i <= buffer.length; ++i) {
    tokenList.push(buffer.substring(0, i));
  }

  return tokenList.reverse();
};

const findNextLargestToken = (dictionary, buffer) => {
  let match = undefined;

  getPossibleTokens(buffer).forEach((token, index) => {
    if (dictionary.indexOf(token) !== -1 && !match) {
      match = {
        position: dictionary.indexOf(token),
        length: token.length
      };
    }
  });

  return match;
};

const substr = (dictionary, from, to) => {
  let reversedDictionary = dictionary
    .split('')
    .reverse()
    .join('');

  if (from === to) {
    return reversedDictionary.charAt(from);
  }

  return reversedDictionary
    .substring(from, from + to)
    .split('')
    .reverse()
    .join('');
};

const extractToken = (dictionary, dictionarySize, position, length) => {
  if (_.isEmpty(dictionary) || dictionarySize === 0) {
    return undefined;
  }

  return substr(dictionary, position, length);
};

export default extractToken;
