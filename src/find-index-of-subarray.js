const invertIndicePosition = (indice, lengthFromIndice, totalListSize) =>
  indice !== -1 ? totalListSize - (indice + lengthFromIndice) : indice;

const findIndexOfSubarray = (searcharray, subarray) => {
  if (!searcharray || !subarray || subarray.length === 0) {
    return -1;
  }

  return invertIndicePosition(searcharray.lastIndexOf(subarray), subarray.length, searcharray.length);
};

export default findIndexOfSubarray;
