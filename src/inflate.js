require('@babel/polyfill');

import _ from 'lodash';

const reverseStr = string =>
  string
    .split('')
    .reverse()
    .join('');

const inflate = stream => {
  let result = '';
  let dictionary = '';

  stream.forEach(item => {
    let expanded = '';
    if (item.prefix !== undefined) {
      expanded = reverseStr(dictionary + item.token).substring(
        item.prefix[0],
        item.prefix[0] + item.prefix[1]
      );
    }
    dictionary += reverseStr(expanded) + item.token;
    result += reverseStr(expanded) + item.token;
  });

  return dictionary;
};

export default inflate;
