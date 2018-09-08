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

const extractToken = (dictionary, dictionarySize, buffer) => {
  if (_.isEmpty(buffer)) {
    return undefined;
  }

  if (dictionary.length === 0) {
    return buffer.charAt(0);
  }

  let nextLargestToken = findNextLargestToken(dictionary, buffer);
  if (!nextLargestToken) {
    nextLargestToken = {
      position: 0,
      length: 0,
      token: buffer.charAt(0)
    };
  } else {
    let offset = 0;
    if (dictionary.length < buffer.length) {
      offset = dictionarySize - dictionary.length;
    }
    nextLargestToken = {
      position: nextLargestToken.position + offset,
      length: nextLargestToken.length,
      token: buffer.charAt(nextLargestToken.length)
    };
  }

  return nextLargestToken;
};

export default extractToken;
