import findIndexOfSubarray from './find-index-of-subarray';

const tokenBinaryReducer = (tokens, dictionary) => {
  if (
    tokens.length === 0 ||
    computeMatch(dictionary, tokens[tokens.length - 1]) === undefined
  ) {
    return Buffer.from([]);
  }

  let items = tokens.length;
  let start = 0;
  let middleIndice = Math.round(items / 2);
  let end = tokens.length;
  while (items > 2) {
    const currentComparison = computeMatch(dictionary, tokens[middleIndice]);
    if (currentComparison !== undefined) {
      end = middleIndice + 1;
      items -= end;
      middleIndice = Math.round(items / 2);
    } else {
      start = middleIndice - 1;
      items -= start;
      middleIndice = Math.round(items / 2);
    }
  }

  return tokens.slice(start, end);
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

const findNextLargestToken = (dictionary, buffer) => {
  let match = undefined;

  let tokens = tokenBinaryReducer(getPossibleTokens(buffer), dictionary);
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
