const findIndexOfSubarray = (searcharray, subarray) => {
  if (!searcharray || !subarray || subarray.length === 0) {
    return -1;
  }

  let result = searcharray.lastIndexOf(subarray);
  if (result !== -1) {
    return searcharray.length - (result + subarray.length);
  } else {
    return result;
  }
};

export default findIndexOfSubarray;
