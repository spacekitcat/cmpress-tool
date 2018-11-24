const positionContains = (searchBuffer, atIndicePosition, containsSubArray) => {
  for (let i = 0; i < containsSubArray.length; ++i) {
    let flippedIndice = atIndicePosition - (containsSubArray.length - 1) + i;
    if (searchBuffer[flippedIndice] !== containsSubArray[i]) {
      return false;
    }
  }

  return true;
};

const findLastPosition = (searcharray, subarray) => {
  let searchStartLocation = searcharray.length - 1;
  let searchMinimumBufferPosition = subarray.length - 1;
  for (let i = searchStartLocation; i >= searchMinimumBufferPosition; --i) {
    if (positionContains(searcharray, i, subarray)) {
      return i;
    }
  }

  return -1;
};

const findIndexOfSubarray = (searcharray, subarray) => {
  let match = -1;

  if (!searcharray || !subarray || subarray.length === 0) {
    return match;
  }

  let result = findLastPosition(searcharray, subarray);
  if (result > -1) {
    return searcharray.length - 1 - findLastPosition(searcharray, subarray);
  } else {
    return result;
  }
};

export default findIndexOfSubarray;
