require('@babel/polyfill');

import _ from 'lodash';

const reverseStr = string =>
  string
    .split('')
    .reverse()
    .join('');

const inflate = stream => {
  let result = '';

  stream.forEach(item => {
    let expanded = '';
    if (item.prefix !== undefined) {
      expanded = reverseStr(result + item.token).substring(
        item.prefix[0],
        item.prefix[0] + item.prefix[1]
      );
    }
    result += reverseStr(expanded) + item.token;
  });

  return result;
};

export default inflate;
