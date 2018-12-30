const findIndexOfSubarray = (searcharray, subarray) => {
  let match = -1;

  if (!searcharray || !subarray || subarray.length === 0) {
    return match;
  }

  let result = searcharray.lastIndexOf(subarray);//findLastPosition(searcharray, subarray);
  if (result !== -1) {
    return searcharray.length - (result + subarray.length);
  } else {
    return result;
  }
};

export default findIndexOfSubarray;
