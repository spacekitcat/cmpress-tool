import _ from 'lodash';
import reverseString from './reverse-string';

const substr = (dictionary, from, to) => {
  let reversedDictionary = reverseString(dictionary);

  if (from === to) {
    return reversedDictionary.charAt(from);
  }

  return reverseString(reversedDictionary.substring(from, from + to));
};

const extractToken = (dictionary, dictionarySize, position, length) => {
  if (_.isEmpty(dictionary) || dictionarySize === 0) {
    return undefined;
  }

  return substr(dictionary, position, length);
};

export default extractToken;
