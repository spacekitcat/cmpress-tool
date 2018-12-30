import findIndexOfSubarray from './find-index-of-subarray';

const tokenBinaryReducer = (tokens, dictionary) => {
  let result = tokens;
  const iterations = tokens.length / 10;
  for (let i = 0; i < iterations; ++i) {
    if (result.length > 1) {
      let middleIndice = result.length / 2;
      if (computeMatch(dictionary, result[middleIndice]) === undefined) {
        result = result.slice(middleIndice - 1, result.length);
      }
    } else {
      break;
    }
  }
  
  return result;
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
  // for (let i = 0; i < 10; ++i) {
  //   if (tokens.length > 1) {
  //     let middleIndice = tokens.length / 2;
  //     if (computeMatch(dictionary, tokens[middleIndice]) === undefined) {
  //       tokens = tokens.slice(middleIndice - 1, tokens.length);
  //     }
  //   } else {
  //     break;
  //   }
  // }

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
