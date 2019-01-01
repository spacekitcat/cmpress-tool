import findIndexOfSubarray from './find-index-of-subarray';

const tokenBinaryReducer = (tokens, dictionary) => {
  let middleIndice = Math.round(tokens.length / 2);
  while (middleIndice > 2) {
    const currentComparison = computeMatch(dictionary, tokens[middleIndice]);
    if (currentComparison !== undefined) {
      tokens = tokens.slice(0, middleIndice + 1);

      middleIndice = Math.round(tokens.length / 2);
    } else {
      tokens = tokens.slice(middleIndice - 1, tokens.length);

      middleIndice = Math.round(tokens.length / 2);
    }
  }

  let match = undefined;
  for (let i = 0; i < tokens.length; ++i) {
    const currentComparison = computeMatch(dictionary, tokens[i]);
    if (currentComparison !== undefined) {
      match = {
        p: [currentComparison + 1, tokens[i].length]
      };
      break;
    }
  }

  return match;
};

const getPossibleTokens = buffer => {
  let tokenList = [];

  for (let i = 4; i < buffer.length; ++i) {
    tokenList.unshift(buffer.slice(0, i));
  }

  return tokenList;
};

const computeMatch = (dictionary, token) => {
  let result = findIndexOfSubarray(dictionary, token);

  return result > -1 ? result : undefined;
};

const findNextLargestToken = (dictionary, buffer) =>
  tokenBinaryReducer(getPossibleTokens(buffer), dictionary);

const locateToken = (dictionary, buffer) => {
  if (buffer === null || buffer === undefined || buffer.length === 0) {
    return {
      t: undefined
    };
  }
  if (dictionary === null) {
    dictionary = Buffer.from([]);
  }

  let nextLargestToken = findNextLargestToken(dictionary, buffer);

  if (nextLargestToken === undefined) {
    nextLargestToken = {
      t: buffer.slice(0, 1)
    };
  } else {
    nextLargestToken.t = buffer.slice(
      nextLargestToken.p[1],
      nextLargestToken.p[1] + 1
    );
  }

  return nextLargestToken;
};

export default locateToken;
