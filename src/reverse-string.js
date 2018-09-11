const santiseInputType = input => (typeof input === 'string' ? input : '');

const reverseString = input =>
  (input = santiseInputType(input)
    .split('')
    .reverse()
    .join(''));

export default reverseString;
