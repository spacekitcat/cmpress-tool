import _ from 'lodash';

const getPossibleTokens = buffer => {
  let tokenList = [];

  for (let i = 0; i < buffer.length - 1; ++i) {
    for (let j = buffer.length - 1; j > i; --j) {
      tokenList.push(buffer.substring(i, j));
    }
  }

  return tokenList;
};

const findNextLargestToken = (dictionary, buffer) => {
  let match = undefined;

  let tokens = getPossibleTokens(buffer);
  for (let i = 0; i < tokens.length; ++i) {
    let token = tokens[i];
    if (dictionary.lastIndexOf(token) !== -1) {
      match = {
        position: Math.max(dictionary.indexOf(token) - 1, 0),
        length: token.length - 1
      };
      break;
    }
  }

  return match;
};

const locateToken = (dictionary, dictionarySize, buffer) => {
  if (_.isEmpty(buffer)) {
    return undefined;
  }

  let nextLargestToken = findNextLargestToken(dictionary, buffer);
  let nextToken = {};
  if (
    nextLargestToken === undefined ||
    (nextLargestToken.position === 0 && nextLargestToken.length === 0)
  ) {
    nextToken = {
      position: 0,
      length: 0,
      token: buffer.charAt(0)
    };
  } else {
    let offset = 1;
    nextToken = {
      position: Math.max(nextLargestToken.position, 1),
      length: Math.max(nextLargestToken.length, 1),
      token: buffer.charAt(Math.max(nextLargestToken.length + 1, 1))
    };
  }

  return nextToken;
};

export default locateToken;
