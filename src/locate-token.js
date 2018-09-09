import _ from 'lodash';

const getPossibleTokens = buffer => {
  let tokenList = [];

  for (let i = 1; i < buffer.length; ++i) {
    tokenList.push(buffer.substring(0, i));
  }

  return tokenList.reverse();
};

const reverseStr = string =>
  string
    .split('')
    .reverse()
    .join('');

const computeMatch = (dictionary, token) => {
  let result = reverseStr(dictionary).indexOf(reverseStr(token));
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

const locateToken = (dictionary, dictionarySize, buffer) => {
  if (_.isEmpty(buffer)) {
    return undefined;
  }

  let nextLargestToken = findNextLargestToken(dictionary, buffer);
  if (
    nextLargestToken === undefined ||
    (nextLargestToken.position === 0 && nextLargestToken.length === 0)
  ) {
    nextLargestToken = {
      prefix: undefined,
      token: buffer.charAt(0)
    };
  } else {
    nextLargestToken.token = buffer.charAt(nextLargestToken.prefix[1]);
  }

  //console.log(`${nextLargestToken.prefix} ${nextLargestToken.token}`);

  return nextLargestToken;
};

export default locateToken;
