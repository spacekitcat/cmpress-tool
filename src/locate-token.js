import _ from 'lodash';
import findIndexOfSubarray from './find-index-of-subarray';

const getPossibleTokens = buffer => {
  let tokenList = [];

  for (let i = 4; i < buffer.length; ++i) {
    tokenList.push(buffer.slice(0, i));
  }

  return tokenList.reverse();
};

const computeMatch = (dictionary, token) => {
  let result = findIndexOfSubarray(dictionary, token);

  return result > -1 ? result : undefined;
};

const findNextLargestToken = (dictionary, buffer) => {
  let match = undefined;

  let tokens = getPossibleTokens(buffer);
  for (let i = 0; i < tokens.length; ++i) {
    if (computeMatch(dictionary, tokens[i]) !== undefined) {
      match = {
        prefix: [computeMatch(dictionary, tokens[i]) + 1, tokens[i].length]
      };
      break;
    }
  }

  return match;
};

const locateToken = (dictionary, buffer) => {
  if (buffer === null || buffer === undefined || buffer.length === 0) {
    return {
      prefix: undefined,
      token: undefined
    };
  }
  if (dictionary === null) {
    dictionary = [];
  }

  let nextLargestToken = findNextLargestToken(dictionary, buffer);

  if (nextLargestToken === undefined) {
    nextLargestToken = {
      prefix: undefined,
      token: buffer[0]
    };
  } else {
    nextLargestToken.token = buffer[nextLargestToken.prefix[1]];
  }

  return nextLargestToken;
};

export default locateToken;
