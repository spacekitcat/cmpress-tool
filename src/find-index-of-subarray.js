const startsWith = (searcharray, subarray) => {
  for (let i = 0; i < subarray.length; ++i) {
    if (searcharray[i] !== subarray[i]) {
      return false;
    }
  }

  return true;
};

const findIndexOfSubarray = (searcharray, subarray) => {
  let match = -1;

  if (!searcharray || !subarray || subarray.length === 0) {
    return match;
  }

  searcharray = searcharray.slice().reverse();
  subarray = subarray.slice().reverse();

  let loopRange = searcharray.length - subarray.length;
  for (let i = 0; i <= loopRange; ++i) {
    if (startsWith(searcharray.slice(i), subarray)) {
      match = i;
      break;
    }
  }

  return match;
};

export default findIndexOfSubarray;
