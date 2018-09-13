import _ from 'lodash';
import reverseString from './reverse-string';

const getPossibleTokens = buffer => {
  let tokenList = [];

  for (let i = 1; i < buffer.length; ++i) {
    tokenList.push(buffer.substring(0, i));
  }

  return tokenList.reverse();
};

const computeMatch = (dictionary, token) => {
  let result = reverseString(dictionary).indexOf(reverseString(token));
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
  if (!buffer || buffer.length === 0) {
    return {
      prefix: undefined,
      token: undefined
    };
  }

  let nextLargestToken = findNextLargestToken(dictionary, buffer);
  if (nextLargestToken === undefined) {
    nextLargestToken = {
      prefix: undefined,
      token: buffer.charAt(0)
    };
  } else {
    nextLargestToken.token = buffer.charAt(nextLargestToken.prefix[1]);
  }

  return nextLargestToken;
};

export default locateToken;
